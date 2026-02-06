// Script to add more authentic Styrian dishes (Round 2)
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'menuplan.db');
const db = new Database(dbPath);

// Weitere authentische steirische Gerichte
const newDishes = [
  // SUPPEN
  {
    name: 'Steirische Saure mit Presswurst',
    category: 'suppe',
    allergens: 'AGLO',
    season: 'all',
    description: 'Saure Suppe mit geräuchertem Fleisch und Presswurst'
  },
  {
    name: 'Erdäpfelsuppe steirisch',
    category: 'suppe',
    allergens: 'AGLO',
    season: 'all',
    description: 'Kräftige Kartoffelsuppe mit Selchwaren und Marjoran'
  },

  // FLEISCHGERICHTE
  {
    name: 'Steirerkrapfen mit Fleisch',
    category: 'fleisch',
    allergens: 'AGMO',
    season: 'all',
    description: 'Roggenpfannkuchen gefüllt mit geselchtem Fleisch, Ennstaler Spezialität'
  },
  {
    name: 'Steirischer Schweinssulz',
    category: 'fleisch',
    allergens: 'GLMO',
    season: 'all',
    description: 'Traditioneller Schweinssulz mit Essig, Zwiebel und Kürbiskernöl'
  },
  {
    name: 'Debreziner mit Sauerkraut',
    category: 'fleisch',
    allergens: 'AMO',
    season: 'all',
    description: 'Würzige ungarische Bratwurst mit Sauerkraut und Senf'
  },
  {
    name: 'Käsekrainer gegrillt',
    category: 'fleisch',
    allergens: 'AGM',
    season: 'all',
    description: 'Steirische Käsewurst vom Grill mit knuspriger Haut'
  },
  {
    name: 'Hauswürstel mit Kraut',
    category: 'fleisch',
    allergens: 'AMO',
    season: 'all',
    description: 'Traditionelle Hauswürstel mit Sauerkraut oder Rotkraut'
  },
  {
    name: 'Krautwickerl',
    category: 'fleisch',
    allergens: 'AGLMO',
    season: 'all',
    description: 'Krautblätter gefüllt mit Faschiertem und Reis, in Tomatensauce'
  },
  {
    name: 'Presswurst auf Erdäpfelsalat',
    category: 'fleisch',
    allergens: 'LMO',
    season: 'all',
    description: 'Traditionelle Presswurst auf warmem steirischem Erdäpfelsalat'
  },
  {
    name: 'Blunzengröstl',
    category: 'fleisch',
    allergens: 'AMO',
    season: 'all',
    description: 'Gebratene Blutwurst mit Kartoffeln und Sauerkraut'
  },

  // FISCH
  {
    name: 'Steirische Bachforelle',
    category: 'fisch',
    allergens: 'ADGL',
    season: 'all',
    description: 'Heimische Bachforelle gebraten mit Butter und Mandeln'
  },

  // VEGETARISCHE GERICHTE
  {
    name: 'Steirerkrapfen mit Käse',
    category: 'vegetarisch',
    allergens: 'AGM',
    season: 'all',
    description: 'Roggenpfannkuchen gefüllt mit Ennstaler Steirerkas'
  },
  {
    name: 'Vogerlsalat mit gebackenem Käse',
    category: 'vegetarisch',
    allergens: 'ACGMO',
    season: 'winter',
    description: 'Feldsalat mit paniertem Käse und Kürbiskernöl-Dressing'
  },
  {
    name: 'Erdäpfel-Vogerlsalat warm',
    category: 'vegetarisch',
    allergens: 'GMO',
    season: 'winter',
    description: 'Warmer Kartoffel-Feldsalat mit Speck und Kürbiskernöl'
  },
  {
    name: 'Kürbisrisotto mit Kernöl',
    category: 'vegetarisch',
    allergens: 'AGL',
    season: 'all',
    description: 'Cremiges Kürbisrisotto verfeinert mit steirischem Kürbiskernöl'
  },
  {
    name: 'Käferbohnen-Laibchen',
    category: 'vegetarisch',
    allergens: 'ACGM',
    season: 'all',
    description: 'Vegetarische Laibchen aus Käferbohnen und Gemüse'
  },

  // BEILAGEN
  {
    name: 'Grammelschmalz',
    category: 'beilage',
    allergens: 'MO',
    season: 'all',
    description: 'Schweineschmalz mit Grieben, klassischer Brotaufstrich'
  },
  {
    name: 'Käferbohnen warm',
    category: 'beilage',
    allergens: 'LMO',
    season: 'all',
    description: 'Warme steirische Käferbohnen als Beilage'
  },
  {
    name: 'Steirischer Vogerlsalat',
    category: 'beilage',
    allergens: 'O',
    season: 'winter',
    description: 'Feldsalat mit Kürbiskernöl-Dressing'
  },
  {
    name: 'Kürbis geröstet',
    category: 'beilage',
    allergens: '',
    season: 'all',
    description: 'Ofengerösteter Kürbis mit Kürbiskernöl'
  },
  {
    name: 'Roggenbrot',
    category: 'beilage',
    allergens: 'A',
    season: 'all',
    description: 'Traditionelles steirisches Roggenbrot'
  },

  // DESSERTS
  {
    name: 'Bauernkrapfen',
    category: 'dessert',
    allergens: 'ACG',
    season: 'all',
    description: 'Ausgezogene Krapfen, traditionell auf der Alm gebacken'
  },
  {
    name: 'Strauben',
    category: 'dessert',
    allergens: 'ACG',
    season: 'all',
    description: 'Steirische Stanglkrapfen, luftig-leicht aus Hefeteig'
  },
  {
    name: 'Schüsserlkrapfen',
    category: 'dessert',
    allergens: 'ACG',
    season: 'all',
    description: 'Kleine runde Krapfen, gefüllt mit Powidl oder Marmelade'
  },
  {
    name: 'Mohnzelten',
    category: 'dessert',
    allergens: 'ACG',
    season: 'all',
    description: 'Germteiggebäck gefüllt mit Mohn, traditionelle Mehlspeise'
  },
  {
    name: 'Kletzenbirnen mit Rahm',
    category: 'dessert',
    allergens: 'G',
    season: 'winter',
    description: 'Gedörrte Birnen gekocht mit Zimt, serviert mit Schlagobers'
  }
];

// Prepare INSERT statement
const insertStmt = db.prepare(`
  INSERT INTO dishes (name, category, allergens, season, created_at)
  VALUES (@name, @category, @allergens, @season, datetime('now'))
`);

// Check for duplicates first
const checkStmt = db.prepare('SELECT COUNT(*) as count FROM dishes WHERE name = ?');

console.log('=== FÜGE WEITERE STEIRISCHE GERICHTE HINZU (RUNDE 2) ===\n');

let addedCount = 0;
let skippedCount = 0;

const transaction = db.transaction((dishes) => {
  for (const dish of dishes) {
    const exists = checkStmt.get(dish.name);
    if (exists.count > 0) {
      console.log(`⚠️  ÜBERSPRUNGEN: ${dish.name} (existiert bereits)`);
      skippedCount++;
    } else {
      insertStmt.run(dish);
      console.log(`✓ HINZUGEFÜGT: ${dish.name} (${dish.category}) [${dish.allergens || 'keine'}]`);
      addedCount++;
    }
  }
});

transaction(newDishes);

console.log(`\n=== ZUSAMMENFASSUNG ===`);
console.log(`${addedCount} neue Gerichte hinzugefügt`);
console.log(`${skippedCount} Gerichte übersprungen (bereits vorhanden)`);

// Show updated statistics
console.log('\n=== AKTUELLE STATISTIK ===');
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
console.log(`\nGESAMT: ${total.count} Gerichte`);

// Show some examples of the new dishes
console.log('\n=== BEISPIELE NEUER GERICHTE ===');
const examples = db.prepare(`
  SELECT name, category, allergens
  FROM dishes
  WHERE name IN (?, ?, ?, ?, ?)
`).all(
  'Schöpsernes',
  'Heidensterz',
  'Käferbohnensuppe',
  'Strauben',
  'Steirerkrapfen mit Fleisch'
);

examples.forEach(dish => {
  console.log(`  ${dish.name} (${dish.category}) [${dish.allergens || 'keine'}]`);
});

db.close();
