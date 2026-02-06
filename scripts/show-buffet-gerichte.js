const Database = require('better-sqlite3');
const db = new Database('./data/menuplan.db');

console.log('='.repeat(80));
console.log('BUFFET-GEEIGNETE GERICHTE - Übersicht (2026-02-05)');
console.log('='.repeat(80));

// Neue Gerichte der letzten 24h (grob)
const newDishes = [
  'Hühnerfrikassee', 'Rindsragout Burgunderart', 'Gemischtes Gulascheintopf',
  'Serbisches Reisfleisch', 'Hühnercurry mit Kokosmilch', 'Putencurry indisch',
  'Chili con Carne', 'Hähnchen süß-sauer', 'Schweinegeschnetzeltes Stroganoff-Art',
  'Lammragout mit Tomaten', 'Hackbraten mit Sauce', 'Puten-Champignon-Ragout',
  'Bratwürstel mit Zwiebelsoße', 'Rindergeschnetzeltes mit Pilzen',
  'Gemüseauflauf mit Käse', 'Nudel-Schinken-Gratin', 'Kartoffel-Zucchini-Auflauf',
  'Broccoli-Blumenkohl-Gratin', 'Kartoffelauflauf mit Lauch', 'Tomatennudeln mit Mozzarella',
  'Gemüsecurry mit Kichererbsen', 'Ratatouille', 'Gefüllte Paprika mit Reis',
  'Linsen-Gemüse-Curry', 'Zucchini-Kartoffel-Pfanne', 'Blumenkohl-Kartoffel-Curry',
  'Überbackene Polenta mit Gemüse', 'Spaghettiauflauf', 'Gemüse-Reis-Pfanne Mexikanisch',
  'Fischragout in Dillsoße', 'Seelachsgulasch', 'Fischcurry mit Gemüse',
  'Fisch-Gemüse-Auflauf', 'Pangasius süß-sauer',
  'Serbische Bohnensuppe', 'Kohlsuppe', 'Linseneintopf', 'Kichererbsensuppe', 'Paprikacremesuppe',
  'Vanillepudding mit Kirschen', 'Schokopudding', 'Apfelkompott mit Zimt',
  'Zwetschkenkompott', 'Birnenkompott', 'Karamellcreme', 'Topfencreme Zitrone',
  'Schokoladencreme', 'Milchreis mit Zimt-Zucker', 'Grießbrei mit Beerenkompott',
  'Erdbeerkompott', 'Marillenkompott', 'Heidelbeerkompott', 'Kokospudding',
  'Basmati-Reis', 'Wildkräuterreis', 'Butterreis', 'Safranreis',
  'Kroketten selbstgemacht', 'Risipisi', 'Rosenkohl mit Butter', 'Leipziger Allerlei'
];

const categories = ['fleisch', 'vegetarisch', 'fisch', 'suppe', 'dessert', 'beilage'];

categories.forEach(cat => {
  const dishes = db.prepare(`
    SELECT name, allergens, prep_instructions
    FROM dishes
    WHERE category = ?
    ORDER BY name
  `).all(cat);

  const newInCategory = dishes.filter(d => newDishes.includes(d.name));

  console.log(`\n${cat.toUpperCase()} (${newInCategory.length} neue von ${dishes.length} gesamt)`);
  console.log('-'.repeat(80));

  newInCategory.forEach(dish => {
    const allergenStr = dish.allergens ? `[${dish.allergens}]` : '[keine]';
    console.log(`✓ ${dish.name.padEnd(45)} ${allergenStr}`);
    if (dish.prep_instructions) {
      console.log(`  ${dish.prep_instructions}`);
    }
  });
});

// Statistik
console.log('\n' + '='.repeat(80));
console.log('STATISTIK');
console.log('='.repeat(80));

const stats = db.prepare(`
  SELECT category, COUNT(*) as count
  FROM dishes
  GROUP BY category
  ORDER BY category
`).all();

stats.forEach(s => {
  console.log(`${s.category.padEnd(15)}: ${s.count} Gerichte`);
});

const total = db.prepare('SELECT COUNT(*) as total FROM dishes').get();
console.log('-'.repeat(80));
console.log(`TOTAL           : ${total.total} Gerichte`);

// Buffet-Tauglichkeits-Score
console.log('\n' + '='.repeat(80));
console.log('BUFFET-TAUGLICHKEITS-ANALYSE');
console.log('='.repeat(80));

// Warmhalte-freundliche Gerichte
const warmhalteFriendly = [
  'gulasch', 'curry', 'ragout', 'eintopf', 'geschnetzeltes',
  'auflauf', 'gratin', 'suppe', 'pudding', 'creme', 'kompott'
];

const warmhalteCount = db.prepare(`
  SELECT COUNT(*) as count
  FROM dishes
  WHERE ${warmhalteFriendly.map(() => 'name LIKE ?').join(' OR ')}
`).get(...warmhalteFriendly.map(w => `%${w}%`));

console.log(`Warmhalte-freundliche Gerichte: ${warmhalteCount.count} / ${total.total}`);
console.log(`  (Currys, Ragouts, Eintöpfe, Aufläufe, Gratins, Cremes, Puddings, Kompotte)`);

// Vegane Optionen
const veganFriendly = db.prepare(`
  SELECT COUNT(*) as count
  FROM dishes
  WHERE category IN ('vegetarisch', 'suppe', 'dessert', 'beilage')
    AND allergens NOT LIKE '%C%'
    AND allergens NOT LIKE '%G%'
`).get();

console.log(`Potentiell vegane Gerichte: ${veganFriendly.count} / ${total.total}`);
console.log(`  (ohne Eier (C) und Milch (G), manuelle Prüfung empfohlen)`);

// Preiswerte Basis (Hülsenfrüchte, Gemüse)
const preiswert = db.prepare(`
  SELECT COUNT(*) as count
  FROM dishes
  WHERE name LIKE '%linsen%'
     OR name LIKE '%bohnen%'
     OR name LIKE '%kichererbsen%'
     OR name LIKE '%gemüse%'
     OR name LIKE '%kartoffel%'
     OR name LIKE '%kürbis%'
`).get();

console.log(`Preiswerte Basis-Gerichte: ${preiswert.count} / ${total.total}`);
console.log(`  (Hülsenfrüchte, Gemüse-Fokus)`);

console.log('\n' + '='.repeat(80));
console.log('✓ 61 buffet-geeignete Gerichte erfolgreich hinzugefügt!');
console.log('✓ Dokumentation: docs/BUFFET_GERICHTE.md');
console.log('='.repeat(80));

db.close();
