// Script to show all Styrian dishes added today
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'menuplan.db');
const db = new Database(dbPath);

console.log('=== STEIRISCHE SPEZIALITÄTEN IN DER DATENBANK ===\n');

// Keywords that indicate Styrian dishes
const steirischeKeywords = [
  'Sterz', 'Käferbohnen', 'Schöpsernes', 'Vogerlsalat', 'Kernöl', 'Kürbiskern',
  'Steirisch', 'Verhackert', 'Steirerkrapfen', 'Strauben', 'Bauernkrapfen',
  'Presswurst', 'Sulz', 'Grammel', 'Backhendlsalat', 'Eierschwammerl',
  'Debreziner', 'Käsekrainer', 'Blunzen', 'Krautwickerl', 'Kletzen'
];

const allDishes = db.prepare(`
  SELECT name, category, allergens, season
  FROM dishes
  ORDER BY category, name
`).all();

// Filter Styrian dishes
const steirischeDishes = allDishes.filter(dish => {
  return steirischeKeywords.some(keyword =>
    dish.name.toLowerCase().includes(keyword.toLowerCase())
  );
});

console.log(`Gefunden: ${steirischeDishes.length} steirische Gerichte\n`);

// Group by category
const categories = {
  suppe: [],
  fleisch: [],
  fisch: [],
  vegetarisch: [],
  beilage: [],
  dessert: []
};

steirischeDishes.forEach(dish => {
  categories[dish.category].push(dish);
});

// Display by category
Object.keys(categories).forEach(cat => {
  if (categories[cat].length > 0) {
    console.log(`--- ${cat.toUpperCase()} (${categories[cat].length}) ---`);
    categories[cat].forEach(dish => {
      const seasonIcon = dish.season === 'summer' ? '☀️' :
                        dish.season === 'winter' ? '❄️' : '🔄';
      console.log(`  ${seasonIcon} ${dish.name} [${dish.allergens || 'keine'}]`);
    });
    console.log('');
  }
});

// Show overall statistics
console.log('=== GESAMTSTATISTIK ===');
const stats = db.prepare(`
  SELECT category, COUNT(*) as count
  FROM dishes
  GROUP BY category
  ORDER BY category
`).all();

stats.forEach(stat => {
  console.log(`${stat.category}: ${stat.count}`);
});

const total = db.prepare('SELECT COUNT(*) as count FROM dishes').get();
console.log(`\nGESAMT: ${total.count} Gerichte in der Datenbank`);

// Show season distribution
console.log('\n=== SAISONALE VERTEILUNG ===');
const seasonStats = db.prepare(`
  SELECT season, COUNT(*) as count
  FROM dishes
  GROUP BY season
`).all();

seasonStats.forEach(stat => {
  const seasonName = stat.season === 'all' ? 'Ganzjährig' :
                    stat.season === 'summer' ? 'Sommer' :
                    stat.season === 'winter' ? 'Winter' : stat.season;
  console.log(`${seasonName}: ${stat.count}`);
});

db.close();
