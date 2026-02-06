// Script to add authentic Styrian dishes to the database
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'menuplan.db');
const db = new Database(dbPath);

// Neue steirische Gerichte mit korrekten Allergenen
const newDishes = [
  // SUPPEN
  {
    name: 'Käferbohnensuppe',
    category: 'suppe',
    allergens: 'AGL',
    season: 'all',
    description: 'Kräftige Suppe aus steirischen Käferbohnen mit Wurzelgemüse und Speck'
  },

  // FLEISCHGERICHTE
  {
    name: 'Schöpsernes',
    category: 'fleisch',
    allergens: 'AGLO',
    season: 'all',
    description: 'Steirischer Lammragout mit Wurzelgemüse, traditionell mit Schöpsenfleisch'
  },
  {
    name: 'Backhendlsalat',
    category: 'fleisch',
    allergens: 'ACGMO',
    season: 'summer',
    description: 'Steirischer Backhendlsalat mit Vogerlsalat, Erdäpfeln und Kürbiskernöl'
  },
  {
    name: 'Rindfleischsalat mit Käferbohnen',
    category: 'fleisch',
    allergens: 'GLMO',
    season: 'all',
    description: 'Klassischer steirischer Salat mit Tafelspitz, Käferbohnen und Kernöl'
  },

  // VEGETARISCHE GERICHTE
  {
    name: 'Heidensterz',
    category: 'vegetarisch',
    allergens: 'AG',
    season: 'all',
    description: 'Traditioneller Buchweizensterz, serviert mit Milch oder Verhackert'
  },
  {
    name: 'Türkensterz',
    category: 'vegetarisch',
    allergens: 'AG',
    season: 'all',
    description: 'Gelber Sterz aus Maisgries, klassische steirische Mehlspeise'
  },
  {
    name: 'Erdäpfelsterz',
    category: 'vegetarisch',
    allergens: 'A',
    season: 'all',
    description: 'Kartoffelsterz, herausgebacken in heißem Fett'
  },
  {
    name: 'Brennsterz',
    category: 'vegetarisch',
    allergens: 'AG',
    season: 'all',
    description: 'Steirischer Sterz aus Maismehl, geröstet mit Butter'
  },
  {
    name: 'Käferbohnensalat mit Kernöl',
    category: 'vegetarisch',
    allergens: 'LMO',
    season: 'all',
    description: 'Steirische Käferbohnen mit Zwiebel, Essig und Kürbiskernöl'
  },
  {
    name: 'Eierschwammerlgulasch',
    category: 'vegetarisch',
    allergens: 'AGLO',
    season: 'summer',
    description: 'Pfifferlinge in cremiger Paprikasauce, klassisches Schwammerlgulasch'
  },
  {
    name: 'Steinpilzrisotto',
    category: 'vegetarisch',
    allergens: 'AGL',
    season: 'all',
    description: 'Cremiges Risotto mit frischen Steinpilzen und Parmesan'
  },
  {
    name: 'Erdäpfel-Vogerlsalat',
    category: 'vegetarisch',
    allergens: 'MO',
    season: 'all',
    description: 'Steirischer Kartoffel-Feldsalat mit Kürbiskernöl'
  },

  // BEILAGEN
  {
    name: 'Verhackert',
    category: 'beilage',
    allergens: 'MO',
    season: 'all',
    description: 'Steirischer Speckaufstrich mit Zwiebel und Knoblauch'
  },
  {
    name: 'Kürbiskernöl-Erdäpfel',
    category: 'beilage',
    allergens: '',
    season: 'all',
    description: 'Salzkartoffeln mit steirischem Kürbiskernöl verfeinert'
  },
  {
    name: 'Steirischer Erdäpfelsalat',
    category: 'beilage',
    allergens: 'LMO',
    season: 'all',
    description: 'Erdäpfelsalat mit Kürbiskernöl statt Mayonnaise'
  },
  {
    name: 'Geröstete Kürbiskerne',
    category: 'beilage',
    allergens: '',
    season: 'all',
    description: 'Knusprig geröstete steirische Kürbiskerne als Topping'
  },

  // DESSERTS
  {
    name: 'Kürbiskernkuchen',
    category: 'dessert',
    allergens: 'ACG',
    season: 'all',
    description: 'Saftiger Rührkuchen mit gemahlenen Kürbiskernen'
  },
  {
    name: 'Sterz süß mit Kompott',
    category: 'dessert',
    allergens: 'AG',
    season: 'all',
    description: 'Süßer Sterz mit Zwetschken- oder Apfelkompott'
  }
];

// Prepare INSERT statement
const insertStmt = db.prepare(`
  INSERT INTO dishes (name, category, allergens, season, created_at)
  VALUES (@name, @category, @allergens, @season, datetime('now'))
`);

// Check for duplicates first
const checkStmt = db.prepare('SELECT COUNT(*) as count FROM dishes WHERE name = ?');

console.log('=== FÜGE STEIRISCHE GERICHTE HINZU ===\n');

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
console.log('\n=== NEUE STATISTIK ===');
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

db.close();
