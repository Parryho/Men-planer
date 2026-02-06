#!/bin/bash
set -euo pipefail

# =============================================================================
# Menuplaner Server Init Script
# Target: Ubuntu 24.04 on Hetzner CX22
# Run as root: bash server-init.sh
# =============================================================================

echo "=== Menuplaner Server Setup ==="

# --- System Update ---
echo ">>> Updating system..."
apt update && apt upgrade -y
apt install -y curl wget git ufw fail2ban htop unzip

# --- Create deploy user ---
echo ">>> Creating deploy user..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash -G sudo deploy
    mkdir -p /home/deploy/.ssh
    # Copy root's authorized_keys to deploy user
    if [ -f /root/.ssh/authorized_keys ]; then
        cp /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
    fi
    chown -R deploy:deploy /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    chmod 600 /home/deploy/.ssh/authorized_keys
    # Allow sudo without password for deploy user
    echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
    echo "Deploy user created."
else
    echo "Deploy user already exists."
fi

# --- SSH Hardening ---
echo ">>> Hardening SSH..."
SSHD_CONFIG="/etc/ssh/sshd_config"
cp "$SSHD_CONFIG" "${SSHD_CONFIG}.bak"

# Disable password authentication
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' "$SSHD_CONFIG"
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' "$SSHD_CONFIG"
sed -i 's/^#\?PubkeyAuthentication.*/PubkeyAuthentication yes/' "$SSHD_CONFIG"
sed -i 's/^#\?ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/' "$SSHD_CONFIG"

systemctl restart sshd
echo "SSH hardened. Root login disabled. Use 'deploy' user from now on."

# --- Firewall (UFW) ---
echo ">>> Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
echo "y" | ufw enable
ufw status

# --- Fail2ban ---
echo ">>> Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'JAILEOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200
JAILEOF

systemctl enable fail2ban
systemctl restart fail2ban

# --- Swap File (2GB) ---
echo ">>> Setting up swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    # Optimize swap behavior
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    sysctl -p
    echo "2GB swap created."
else
    echo "Swap already exists."
fi

# --- Install Docker ---
echo ">>> Installing Docker..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker deploy
    systemctl enable docker
    systemctl start docker
    echo "Docker installed."
else
    echo "Docker already installed."
fi

# --- Install Docker Compose plugin ---
echo ">>> Verifying Docker Compose..."
docker compose version

# --- Create app directories ---
echo ">>> Creating app directories..."
mkdir -p /opt/menuplaner/data
mkdir -p /opt/menuplaner/nginx/certs
mkdir -p /opt/menuplaner/backups
chown -R deploy:deploy /opt/menuplaner

# --- Setup log rotation ---
echo ">>> Configuring log rotation..."
cat > /etc/logrotate.d/menuplaner << 'LOGEOF'
/opt/menuplaner/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0640 deploy deploy
}
LOGEOF

# --- Automatic security updates ---
echo ">>> Enabling automatic security updates..."
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

echo ""
echo "=== Server setup complete! ==="
echo ""
echo "NEXT STEPS:"
echo "1. Log out and log back in as 'deploy' user:"
echo "   ssh deploy@<server-ip>"
echo ""
echo "2. Copy your deployment files to /opt/menuplaner/"
echo ""
echo "3. Create .env.production in /opt/menuplaner/:"
echo "   cp .env.example .env.production"
echo "   nano .env.production  # Fill in real values"
echo ""
echo "4. Add Cloudflare Origin Certificate:"
echo "   nano /opt/menuplaner/nginx/certs/cert.pem"
echo "   nano /opt/menuplaner/nginx/certs/key.pem"
echo ""
echo "5. Start the application:"
echo "   cd /opt/menuplaner && docker compose -f docker-compose.prod.yml up -d"
echo ""
