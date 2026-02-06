// Script to check existing dishes in DB
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'menuplan.db');
const db = new Database(dbPath);

console.log('\n=== KATEGORIEN ÜBERSICHT ===');
const categoryStats = db.prepare(`
  SELECT category, COUNT(*) as count
  FROM dishes
  GROUP BY category
  ORDER BY category
`).all();

categoryStats.forEach(stat => {
  console.log(`${stat.category}: ${stat.count}`);
});

console.log('\n=== ALLE GERICHTE ===');
const allDishes = db.prepare(`
  SELECT name, category, allergens
  FROM dishes
  ORDER BY category, name
`).all();

let currentCategory = '';
allDishes.forEach(dish => {
  if (dish.category !== currentCategory) {
    currentCategory = dish.category;
    console.log(`\n--- ${currentCategory.toUpperCase()} ---`);
  }
  console.log(`  ${dish.name} [${dish.allergens || 'keine'}]`);
});

console.log(`\n=== GESAMT: ${allDishes.length} Gerichte ===`);

db.close();
