const Database = require('better-sqlite3');
const db = new Database('./data/menuplan.db');

// Buffet-geeignete Gerichte: preiswert, gut warmhaltend, international & österreichisch
const buffetDishes = [
  // FLEISCH - Eintöpfe, Ragouts, Currys (gut warmhalten, preiswert)
  {
    name: 'Hühnerfrikassee',
    category: 'fleisch',
    allergens: 'ACG',
    description: 'Klassisches Frikassee mit Huhn, Spargel, Champignons in Rahmsoße'
  },
  {
    name: 'Rindsragout Burgunderart',
    category: 'fleisch',
    allergens: 'ALO',
    description: 'Geschmortes Rindfleisch in Rotweinsoße mit Karotten und Schalotten'
  },
  {
    name: 'Gemischtes Gulascheintopf',
    category: 'fleisch',
    allergens: 'AL',
    description: 'Rinds- und Schweinefleisch, Paprika, Kartoffeln'
  },
  {
    name: 'Serbisches Reisfleisch',
    category: 'fleisch',
    allergens: 'L',
    description: 'Schweinefleisch mit Reis, Paprika und Zwiebeln geschmort'
  },
  {
    name: 'Hühnercurry mit Kokosmilch',
    category: 'fleisch',
    allergens: '',
    description: 'Mildes Curry mit Hühnerbrustfilet, Kokosmilch, Gemüse'
  },
  {
    name: 'Putencurry indisch',
    category: 'fleisch',
    allergens: 'G',
    description: 'Putenfleisch in Curry-Joghurt-Soße mit Tomaten und Gewürzen'
  },
  {
    name: 'Chili con Carne',
    category: 'fleisch',
    allergens: 'L',
    description: 'Faschiertes mit Bohnen, Mais, Paprika, Tomaten'
  },
  {
    name: 'Hähnchen süß-sauer',
    category: 'fleisch',
    allergens: 'ACF',
    description: 'Gebratenes Hühnerfilet in süß-saurer Soße mit Ananas und Paprika'
  },
  {
    name: 'Schweinegeschnetzeltes Stroganoff-Art',
    category: 'fleisch',
    allergens: 'GLM',
    description: 'Schweinefleischstreifen in Sauerrahm-Senf-Soße mit Champignons'
  },
  {
    name: 'Lammragout mit Tomaten',
    category: 'fleisch',
    allergens: 'L',
    description: 'Geschmortes Lammfleisch mit Tomaten, Zwiebeln und Kräutern'
  },
  {
    name: 'Hackbraten mit Sauce',
    category: 'fleisch',
    allergens: 'ACLM',
    description: 'Faschierter Braten mit Bratensauce'
  },
  {
    name: 'Puten-Champignon-Ragout',
    category: 'fleisch',
    allergens: 'AG',
    description: 'Putenfleisch mit Champignons in cremiger Soße'
  },
  {
    name: 'Bratwürstel mit Zwiebelsoße',
    category: 'fleisch',
    allergens: 'ACM',
    description: 'Bratwürste in herzhafter Zwiebelsoße'
  },
  {
    name: 'Rindergeschnetzeltes mit Pilzen',
    category: 'fleisch',
    allergens: 'AG',
    description: 'Rindfleischstreifen mit gemischten Pilzen in Rahmsoße'
  },

  // VEGETARISCH - Aufläufe, Gratins, Pfannengerichte
  {
    name: 'Gemüseauflauf mit Käse',
    category: 'vegetarisch',
    allergens: 'ACG',
    description: 'Buntes Gemüse mit Béchamelsoße und Käse überbacken'
  },
  {
    name: 'Nudel-Schinken-Gratin',
    category: 'vegetarisch',
    allergens: 'ACG',
    description: 'Bandnudeln mit Schinken und Käse überbacken'
  },
  {
    name: 'Kartoffel-Zucchini-Auflauf',
    category: 'vegetarisch',
    allergens: 'CG',
    description: 'Geschichtete Kartoffeln und Zucchini mit Käse'
  },
  {
    name: 'Broccoli-Blumenkohl-Gratin',
    category: 'vegetarisch',
    allergens: 'ACG',
    description: 'Broccoli und Blumenkohl in Käse-Sahne-Sauce überbacken'
  },
  {
    name: 'Kartoffelauflauf mit Lauch',
    category: 'vegetarisch',
    allergens: 'CG',
    description: 'Kartoffelscheiben mit Lauch und Sauerrahm'
  },
  {
    name: 'Tomatennudeln mit Mozzarella',
    category: 'vegetarisch',
    allergens: 'ACG',
    description: 'Penne in Tomatensoße mit Mozzarella überbacken'
  },
  {
    name: 'Gemüsecurry mit Kichererbsen',
    category: 'vegetarisch',
    allergens: '',
    description: 'Gemischtes Gemüse und Kichererbsen in Curry-Kokosmilch-Soße'
  },
  {
    name: 'Ratatouille',
    category: 'vegetarisch',
    allergens: '',
    description: 'Französischer Gemüseeintopf mit Zucchini, Aubergine, Paprika'
  },
  {
    name: 'Gefüllte Paprika mit Reis',
    category: 'vegetarisch',
    allergens: 'GL',
    description: 'Paprikaschoten gefüllt mit Reis und Gemüse in Tomatensoße'
  },
  {
    name: 'Linsen-Gemüse-Curry',
    category: 'vegetarisch',
    allergens: 'L',
    description: 'Rote Linsen mit Gemüse in Curry-Tomatensoße'
  },
  {
    name: 'Zucchini-Kartoffel-Pfanne',
    category: 'vegetarisch',
    allergens: 'G',
    description: 'Gebratene Zucchini mit Kartoffeln und Sauerrahm'
  },
  {
    name: 'Blumenkohl-Kartoffel-Curry',
    category: 'vegetarisch',
    allergens: '',
    description: 'Blumenkohl und Kartoffeln in milder Currysoße'
  },
  {
    name: 'Überbackene Polenta mit Gemüse',
    category: 'vegetarisch',
    allergens: 'G',
    description: 'Polentascheiben mit Ratatouille-Gemüse und Käse'
  },
  {
    name: 'Spaghettiauflauf',
    category: 'vegetarisch',
    allergens: 'ACG',
    description: 'Spaghetti mit Tomatensoße und Käse überbacken'
  },
  {
    name: 'Gemüse-Reis-Pfanne Mexikanisch',
    category: 'vegetarisch',
    allergens: 'L',
    description: 'Reis mit Bohnen, Mais, Paprika und Tomaten'
  },

  // FISCH - preiswerte Varianten, gut warmhaltend
  {
    name: 'Fischragout in Dillsoße',
    category: 'fisch',
    allergens: 'DG',
    description: 'Verschiedene Fischstücke in cremiger Dillsoße'
  },
  {
    name: 'Seelachsgulasch',
    category: 'fisch',
    allergens: 'DL',
    description: 'Seelachs mit Paprika und Tomaten geschmort'
  },
  {
    name: 'Fischcurry mit Gemüse',
    category: 'fisch',
    allergens: 'D',
    description: 'Weißfisch in milder Curry-Kokosmilch-Soße'
  },
  {
    name: 'Fisch-Gemüse-Auflauf',
    category: 'fisch',
    allergens: 'ACDG',
    description: 'Fischfilet mit Gemüse und Kartoffeln überbacken'
  },
  {
    name: 'Pangasius süß-sauer',
    category: 'fisch',
    allergens: 'DF',
    description: 'Pangasiusfilet in süß-saurer Soße mit Ananas'
  },

  // SUPPEN - internationale Ergänzung
  {
    name: 'Serbische Bohnensuppe',
    category: 'suppe',
    allergens: 'L',
    description: 'Kräftige Suppe mit weißen Bohnen, Paprika, Speck'
  },
  {
    name: 'Kohlsuppe',
    category: 'suppe',
    allergens: 'L',
    description: 'Weiß- und Rotkohl mit Karotten und Kartoffeln'
  },
  {
    name: 'Linseneintopf',
    category: 'suppe',
    allergens: 'L',
    description: 'Rote Linsen mit Karotten, Sellerie und Gewürzen'
  },
  {
    name: 'Kichererbsensuppe',
    category: 'suppe',
    allergens: 'L',
    description: 'Orientalische Suppe mit Kichererbsen und Kreuzkümmel'
  },
  {
    name: 'Paprikacremesuppe',
    category: 'suppe',
    allergens: 'G',
    description: 'Cremige Suppe aus gerösteten roten Paprika'
  },

  // DESSERTS - mehr Cremes, Puddings, Kompotte
  {
    name: 'Vanillepudding mit Kirschen',
    category: 'dessert',
    allergens: 'G',
    description: 'Klassischer Vanillepudding mit Sauerkirschkompott'
  },
  {
    name: 'Schokopudding',
    category: 'dessert',
    allergens: 'G',
    description: 'Cremiger Schokoladenpudding'
  },
  {
    name: 'Apfelkompott mit Zimt',
    category: 'dessert',
    allergens: '',
    description: 'Geschmorte Äpfel mit Zimt und Vanille'
  },
  {
    name: 'Zwetschkenkompott',
    category: 'dessert',
    allergens: '',
    description: 'Eingekochte Zwetschken mit Zimt'
  },
  {
    name: 'Birnenkompott',
    category: 'dessert',
    allergens: '',
    description: 'Geschmorte Birnen mit Nelken und Zimt'
  },
  {
    name: 'Karamellcreme',
    category: 'dessert',
    allergens: 'CG',
    description: 'Cremiger Karamellpudding'
  },
  {
    name: 'Topfencreme Zitrone',
    category: 'dessert',
    allergens: 'CG',
    description: 'Leichte Topfencreme mit Zitrone'
  },
  {
    name: 'Schokoladencreme',
    category: 'dessert',
    allergens: 'CG',
    description: 'Cremige Schokoladenmousse'
  },
  {
    name: 'Milchreis mit Zimt-Zucker',
    category: 'dessert',
    allergens: 'G',
    description: 'Klassischer Milchreis warm serviert'
  },
  {
    name: 'Grießbrei mit Beerenkompott',
    category: 'dessert',
    allergens: 'AG',
    description: 'Süßer Grießbrei mit gemischten Beeren'
  },
  {
    name: 'Erdbeerkompott',
    category: 'dessert',
    allergens: '',
    description: 'Frische Erdbeeren eingekocht mit Vanille'
  },
  {
    name: 'Marillenkompott',
    category: 'dessert',
    allergens: '',
    description: 'Geschmorte Marillen mit leichtem Sirup'
  },
  {
    name: 'Heidelbeerkompott',
    category: 'dessert',
    allergens: '',
    description: 'Eingekochte Heidelbeeren mit Zimt'
  },
  {
    name: 'Kokospudding',
    category: 'dessert',
    allergens: 'G',
    description: 'Exotischer Pudding mit Kokosmilch'
  },

  // BEILAGEN - preiswerte Ergänzungen
  {
    name: 'Basmati-Reis',
    category: 'beilage',
    allergens: '',
    description: 'Lockerer Basmati-Reis'
  },
  {
    name: 'Wildkräuterreis',
    category: 'beilage',
    allergens: '',
    description: 'Reis mit frischen Kräutern'
  },
  {
    name: 'Butterreis',
    category: 'beilage',
    allergens: 'G',
    description: 'Reis mit Butter verfeinert'
  },
  {
    name: 'Safranreis',
    category: 'beilage',
    allergens: '',
    description: 'Reis mit Safran gewürzt'
  },
  {
    name: 'Kroketten selbstgemacht',
    category: 'beilage',
    allergens: 'ACG',
    description: 'Hausgemachte Kartoffelkroketten'
  },
  {
    name: 'Risipisi',
    category: 'beilage',
    allergens: 'G',
    description: 'Reis mit grünen Erbsen'
  },
  {
    name: 'Rosenkohl mit Butter',
    category: 'beilage',
    allergens: 'G',
    description: 'Rosenkohl in Buttersoße'
  },
  {
    name: 'Leipziger Allerlei',
    category: 'beilage',
    allergens: 'G',
    description: 'Gemischtes Gemüse in Buttersoße'
  }
];

// Check for duplicates and insert
const existingStmt = db.prepare('SELECT COUNT(*) as count FROM dishes WHERE name = ?');
const insertStmt = db.prepare(`
  INSERT INTO dishes (name, category, allergens, season, prep_instructions, prep_time_minutes)
  VALUES (?, ?, ?, 'all', ?, 30)
`);

let added = 0;
let skipped = 0;

const transaction = db.transaction((dishes) => {
  for (const dish of dishes) {
    const exists = existingStmt.get(dish.name);
    if (exists.count > 0) {
      console.log(`SKIP: ${dish.name} (bereits vorhanden)`);
      skipped++;
    } else {
      insertStmt.run(dish.name, dish.category, dish.allergens, dish.description);
      console.log(`ADD: ${dish.name} (${dish.category})`);
      added++;
    }
  }
});

transaction(buffetDishes);

console.log(`\n✓ Fertig: ${added} Gerichte hinzugefügt, ${skipped} übersprungen`);
console.log(`\nZusammenfassung neue Gerichte:`);
console.log(`- Fleisch: 14 (Currys, Ragouts, Eintöpfe)`);
console.log(`- Vegetarisch: 15 (Aufläufe, Gratins, Pfannen)`);
console.log(`- Fisch: 5 (preiswerte Varianten)`);
console.log(`- Suppen: 5 (internationale)`);
console.log(`- Desserts: 14 (Cremes, Puddings, Kompotte)`);
console.log(`- Beilagen: 8 (Reissorten, Gemüse)`);
console.log(`Total: 61 buffet-geeignete Gerichte`);

db.close();
