import { getDb } from './db';

// Types
interface IngredientSeed {
  name: string;
  category: 'fleisch' | 'fisch' | 'gemuese' | 'milchprodukte' | 'trockenwaren' | 'gewuerze' | 'eier_fette' | 'obst' | 'tiefkuehl' | 'sonstiges';
  unit: 'g' | 'kg' | 'ml' | 'l' | 'stueck';
  price_per_unit: number;
  price_unit: 'g' | 'kg' | 'ml' | 'l' | 'stueck';
  supplier: string;
}

interface RecipeItemSeed {
  dish: string;
  ingredient: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'stueck';
  note: string;
}

// =====================================================================
// ZUTATEN
// =====================================================================

const INGREDIENTS: IngredientSeed[] = [
  // --- FLEISCH & WURST ---
  { name: 'Schweinefleisch', category: 'fleisch', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Schweinsschnitzel', category: 'fleisch', unit: 'kg', price_per_unit: 10.50, price_unit: 'kg', supplier: '' },
  { name: 'Schweinshaxe', category: 'fleisch', unit: 'kg', price_per_unit: 7.50, price_unit: 'kg', supplier: '' },
  { name: 'Schweinefilet', category: 'fleisch', unit: 'kg', price_per_unit: 14.90, price_unit: 'kg', supplier: '' },
  { name: 'Rindfleisch', category: 'fleisch', unit: 'kg', price_per_unit: 14.90, price_unit: 'kg', supplier: '' },
  { name: 'Rindsgulaschfleisch', category: 'fleisch', unit: 'kg', price_per_unit: 12.90, price_unit: 'kg', supplier: '' },
  { name: 'Tafelspitz (Rind)', category: 'fleisch', unit: 'kg', price_per_unit: 16.90, price_unit: 'kg', supplier: '' },
  { name: 'Kalbfleisch', category: 'fleisch', unit: 'kg', price_per_unit: 18.90, price_unit: 'kg', supplier: '' },
  { name: 'Hühnerbrust', category: 'fleisch', unit: 'kg', price_per_unit: 9.90, price_unit: 'kg', supplier: '' },
  { name: 'Hühnerkeulen', category: 'fleisch', unit: 'kg', price_per_unit: 6.90, price_unit: 'kg', supplier: '' },
  { name: 'Putenfilet', category: 'fleisch', unit: 'kg', price_per_unit: 11.90, price_unit: 'kg', supplier: '' },
  { name: 'Putenschnitzel', category: 'fleisch', unit: 'kg', price_per_unit: 11.50, price_unit: 'kg', supplier: '' },
  { name: 'Faschiertes (Rind/Schwein)', category: 'fleisch', unit: 'kg', price_per_unit: 8.50, price_unit: 'kg', supplier: '' },
  { name: 'Leber (Kalb)', category: 'fleisch', unit: 'kg', price_per_unit: 12.90, price_unit: 'kg', supplier: '' },
  { name: 'Geselchtes', category: 'fleisch', unit: 'kg', price_per_unit: 9.90, price_unit: 'kg', supplier: '' },
  { name: 'Leberkäse', category: 'fleisch', unit: 'kg', price_per_unit: 7.90, price_unit: 'kg', supplier: '' },
  { name: 'Schinken (gekocht)', category: 'fleisch', unit: 'kg', price_per_unit: 12.90, price_unit: 'kg', supplier: '' },
  { name: 'Speck', category: 'fleisch', unit: 'kg', price_per_unit: 11.90, price_unit: 'kg', supplier: '' },
  { name: 'Innereien (Beuschel)', category: 'fleisch', unit: 'kg', price_per_unit: 6.90, price_unit: 'kg', supplier: '' },

  // --- FISCH ---
  { name: 'Lachsfilet', category: 'fisch', unit: 'kg', price_per_unit: 24.90, price_unit: 'kg', supplier: '' },
  { name: 'Seehechtfilet', category: 'fisch', unit: 'kg', price_per_unit: 14.90, price_unit: 'kg', supplier: '' },
  { name: 'Seelachsfilet', category: 'fisch', unit: 'kg', price_per_unit: 12.90, price_unit: 'kg', supplier: '' },
  { name: 'Forellenfilet', category: 'fisch', unit: 'kg', price_per_unit: 18.90, price_unit: 'kg', supplier: '' },
  { name: 'Zanderfilet', category: 'fisch', unit: 'kg', price_per_unit: 22.90, price_unit: 'kg', supplier: '' },
  { name: 'Pangasiusfilet', category: 'fisch', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Kabeljaufilet', category: 'fisch', unit: 'kg', price_per_unit: 16.90, price_unit: 'kg', supplier: '' },
  { name: 'Karpfen', category: 'fisch', unit: 'kg', price_per_unit: 10.90, price_unit: 'kg', supplier: '' },
  { name: 'Saiblingfilet', category: 'fisch', unit: 'kg', price_per_unit: 20.90, price_unit: 'kg', supplier: '' },
  { name: 'Thunfisch (Dose)', category: 'fisch', unit: 'kg', price_per_unit: 15.90, price_unit: 'kg', supplier: '' },
  { name: 'Fischstäbchen (TK)', category: 'fisch', unit: 'kg', price_per_unit: 7.90, price_unit: 'kg', supplier: '' },
  { name: 'Lachsforellenfilet', category: 'fisch', unit: 'kg', price_per_unit: 19.90, price_unit: 'kg', supplier: '' },

  // --- GEMÜSE & SALAT ---
  { name: 'Kartoffeln', category: 'gemuese', unit: 'kg', price_per_unit: 1.50, price_unit: 'kg', supplier: '' },
  { name: 'Karotten', category: 'gemuese', unit: 'kg', price_per_unit: 1.80, price_unit: 'kg', supplier: '' },
  { name: 'Zwiebeln', category: 'gemuese', unit: 'kg', price_per_unit: 1.50, price_unit: 'kg', supplier: '' },
  { name: 'Knoblauch', category: 'gemuese', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Tomaten', category: 'gemuese', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'Tomaten (Dose/passiert)', category: 'gemuese', unit: 'kg', price_per_unit: 2.20, price_unit: 'kg', supplier: '' },
  { name: 'Paprika', category: 'gemuese', unit: 'kg', price_per_unit: 4.50, price_unit: 'kg', supplier: '' },
  { name: 'Spinat (frisch)', category: 'gemuese', unit: 'kg', price_per_unit: 6.90, price_unit: 'kg', supplier: '' },
  { name: 'Brokkoli', category: 'gemuese', unit: 'kg', price_per_unit: 4.50, price_unit: 'kg', supplier: '' },
  { name: 'Kürbis', category: 'gemuese', unit: 'kg', price_per_unit: 2.50, price_unit: 'kg', supplier: '' },
  { name: 'Zucchini', category: 'gemuese', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'Sellerie', category: 'gemuese', unit: 'kg', price_per_unit: 3.90, price_unit: 'kg', supplier: '' },
  { name: 'Lauch', category: 'gemuese', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'Spargel', category: 'gemuese', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Champignons', category: 'gemuese', unit: 'kg', price_per_unit: 5.90, price_unit: 'kg', supplier: '' },
  { name: 'Erbsen (frisch/TK)', category: 'gemuese', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'Weißkraut', category: 'gemuese', unit: 'kg', price_per_unit: 1.50, price_unit: 'kg', supplier: '' },
  { name: 'Rotkraut', category: 'gemuese', unit: 'kg', price_per_unit: 1.80, price_unit: 'kg', supplier: '' },
  { name: 'Gurke', category: 'gemuese', unit: 'kg', price_per_unit: 2.50, price_unit: 'kg', supplier: '' },
  { name: 'Blattsalat', category: 'gemuese', unit: 'kg', price_per_unit: 5.90, price_unit: 'kg', supplier: '' },
  { name: 'Sauerkraut', category: 'gemuese', unit: 'kg', price_per_unit: 2.90, price_unit: 'kg', supplier: '' },
  { name: 'Fisolen (grüne Bohnen)', category: 'gemuese', unit: 'kg', price_per_unit: 4.90, price_unit: 'kg', supplier: '' },
  { name: 'Linsen', category: 'gemuese', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },

  // --- MILCHPRODUKTE ---
  { name: 'Butter', category: 'milchprodukte', unit: 'kg', price_per_unit: 9.90, price_unit: 'kg', supplier: '' },
  { name: 'Sahne (Schlagobers)', category: 'milchprodukte', unit: 'l', price_per_unit: 4.50, price_unit: 'l', supplier: '' },
  { name: 'Milch', category: 'milchprodukte', unit: 'l', price_per_unit: 1.30, price_unit: 'l', supplier: '' },
  { name: 'Sauerrahm', category: 'milchprodukte', unit: 'kg', price_per_unit: 3.90, price_unit: 'kg', supplier: '' },
  { name: 'Joghurt (natur)', category: 'milchprodukte', unit: 'kg', price_per_unit: 2.90, price_unit: 'kg', supplier: '' },
  { name: 'Topfen', category: 'milchprodukte', unit: 'kg', price_per_unit: 4.50, price_unit: 'kg', supplier: '' },
  { name: 'Emmentaler', category: 'milchprodukte', unit: 'kg', price_per_unit: 12.90, price_unit: 'kg', supplier: '' },
  { name: 'Schafkäse (Feta)', category: 'milchprodukte', unit: 'kg', price_per_unit: 10.90, price_unit: 'kg', supplier: '' },
  { name: 'Parmesan', category: 'milchprodukte', unit: 'kg', price_per_unit: 18.90, price_unit: 'kg', supplier: '' },
  { name: 'Gouda', category: 'milchprodukte', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Mascarpone', category: 'milchprodukte', unit: 'kg', price_per_unit: 8.50, price_unit: 'kg', supplier: '' },
  { name: 'Mozzarella', category: 'milchprodukte', unit: 'kg', price_per_unit: 7.90, price_unit: 'kg', supplier: '' },

  // --- TROCKENWAREN & GETREIDE ---
  { name: 'Mehl (glatt)', category: 'trockenwaren', unit: 'kg', price_per_unit: 1.20, price_unit: 'kg', supplier: '' },
  { name: 'Mehl (griffig)', category: 'trockenwaren', unit: 'kg', price_per_unit: 1.30, price_unit: 'kg', supplier: '' },
  { name: 'Reis (Langkorn)', category: 'trockenwaren', unit: 'kg', price_per_unit: 2.50, price_unit: 'kg', supplier: '' },
  { name: 'Risotto-Reis', category: 'trockenwaren', unit: 'kg', price_per_unit: 3.90, price_unit: 'kg', supplier: '' },
  { name: 'Nudeln (Spaghetti)', category: 'trockenwaren', unit: 'kg', price_per_unit: 1.90, price_unit: 'kg', supplier: '' },
  { name: 'Nudeln (Bandnudeln)', category: 'trockenwaren', unit: 'kg', price_per_unit: 2.20, price_unit: 'kg', supplier: '' },
  { name: 'Tortellini', category: 'trockenwaren', unit: 'kg', price_per_unit: 5.90, price_unit: 'kg', supplier: '' },
  { name: 'Lasagneblätter', category: 'trockenwaren', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'Semmelbrösel', category: 'trockenwaren', unit: 'kg', price_per_unit: 2.90, price_unit: 'kg', supplier: '' },
  { name: 'Couscous', category: 'trockenwaren', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'Polenta (Maisgrieß)', category: 'trockenwaren', unit: 'kg', price_per_unit: 2.50, price_unit: 'kg', supplier: '' },
  { name: 'Grieß', category: 'trockenwaren', unit: 'kg', price_per_unit: 1.50, price_unit: 'kg', supplier: '' },
  { name: 'Zucker', category: 'trockenwaren', unit: 'kg', price_per_unit: 1.20, price_unit: 'kg', supplier: '' },
  { name: 'Staubzucker', category: 'trockenwaren', unit: 'kg', price_per_unit: 1.80, price_unit: 'kg', supplier: '' },
  { name: 'Vanillezucker', category: 'trockenwaren', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Backpulver', category: 'trockenwaren', unit: 'kg', price_per_unit: 5.90, price_unit: 'kg', supplier: '' },
  { name: 'Germ (Hefe)', category: 'trockenwaren', unit: 'kg', price_per_unit: 7.90, price_unit: 'kg', supplier: '' },
  { name: 'Gelatine', category: 'trockenwaren', unit: 'kg', price_per_unit: 25.00, price_unit: 'kg', supplier: '' },
  { name: 'Kakao', category: 'trockenwaren', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Schokolade (Kochschokolade)', category: 'trockenwaren', unit: 'kg', price_per_unit: 7.90, price_unit: 'kg', supplier: '' },
  { name: 'Mohn (gemahlen)', category: 'trockenwaren', unit: 'kg', price_per_unit: 12.90, price_unit: 'kg', supplier: '' },
  { name: 'Powidl (Pflaumenmus)', category: 'trockenwaren', unit: 'kg', price_per_unit: 5.90, price_unit: 'kg', supplier: '' },
  { name: 'Marmelade', category: 'trockenwaren', unit: 'kg', price_per_unit: 4.90, price_unit: 'kg', supplier: '' },
  { name: 'Suppennudeln', category: 'trockenwaren', unit: 'kg', price_per_unit: 2.50, price_unit: 'kg', supplier: '' },
  { name: 'Strudelteig', category: 'trockenwaren', unit: 'kg', price_per_unit: 4.90, price_unit: 'kg', supplier: '' },

  // --- GEWÜRZE & KRÄUTER ---
  { name: 'Salz', category: 'gewuerze', unit: 'kg', price_per_unit: 0.80, price_unit: 'kg', supplier: '' },
  { name: 'Pfeffer (schwarz)', category: 'gewuerze', unit: 'kg', price_per_unit: 18.90, price_unit: 'kg', supplier: '' },
  { name: 'Paprikapulver (edelsüß)', category: 'gewuerze', unit: 'kg', price_per_unit: 12.90, price_unit: 'kg', supplier: '' },
  { name: 'Kümmel', category: 'gewuerze', unit: 'kg', price_per_unit: 10.90, price_unit: 'kg', supplier: '' },
  { name: 'Currypulver', category: 'gewuerze', unit: 'kg', price_per_unit: 14.90, price_unit: 'kg', supplier: '' },
  { name: 'Muskatnuss', category: 'gewuerze', unit: 'kg', price_per_unit: 25.00, price_unit: 'kg', supplier: '' },
  { name: 'Majoran', category: 'gewuerze', unit: 'kg', price_per_unit: 15.90, price_unit: 'kg', supplier: '' },
  { name: 'Petersilie', category: 'gewuerze', unit: 'kg', price_per_unit: 12.00, price_unit: 'kg', supplier: '' },
  { name: 'Schnittlauch', category: 'gewuerze', unit: 'kg', price_per_unit: 14.00, price_unit: 'kg', supplier: '' },
  { name: 'Dill', category: 'gewuerze', unit: 'kg', price_per_unit: 14.00, price_unit: 'kg', supplier: '' },
  { name: 'Basilikum', category: 'gewuerze', unit: 'kg', price_per_unit: 14.00, price_unit: 'kg', supplier: '' },
  { name: 'Oregano', category: 'gewuerze', unit: 'kg', price_per_unit: 12.00, price_unit: 'kg', supplier: '' },
  { name: 'Lorbeerblätter', category: 'gewuerze', unit: 'kg', price_per_unit: 30.00, price_unit: 'kg', supplier: '' },
  { name: 'Zimt', category: 'gewuerze', unit: 'kg', price_per_unit: 18.00, price_unit: 'kg', supplier: '' },
  { name: 'Vanilleschote', category: 'gewuerze', unit: 'stueck', price_per_unit: 3.50, price_unit: 'stueck', supplier: '' },

  // --- EIER & FETTE ---
  { name: 'Eier', category: 'eier_fette', unit: 'stueck', price_per_unit: 0.35, price_unit: 'stueck', supplier: '' },
  { name: 'Pflanzenöl', category: 'eier_fette', unit: 'l', price_per_unit: 2.50, price_unit: 'l', supplier: '' },
  { name: 'Olivenöl', category: 'eier_fette', unit: 'l', price_per_unit: 7.90, price_unit: 'l', supplier: '' },
  { name: 'Butterschmalz', category: 'eier_fette', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Schmalz', category: 'eier_fette', unit: 'kg', price_per_unit: 4.90, price_unit: 'kg', supplier: '' },

  // --- OBST & FRÜCHTE ---
  { name: 'Äpfel', category: 'obst', unit: 'kg', price_per_unit: 2.90, price_unit: 'kg', supplier: '' },
  { name: 'Zitronen', category: 'obst', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'Beeren (gemischt)', category: 'obst', unit: 'kg', price_per_unit: 9.90, price_unit: 'kg', supplier: '' },
  { name: 'Marillen', category: 'obst', unit: 'kg', price_per_unit: 5.90, price_unit: 'kg', supplier: '' },
  { name: 'Zwetschken', category: 'obst', unit: 'kg', price_per_unit: 3.90, price_unit: 'kg', supplier: '' },
  { name: 'Preiselbeeren (Glas)', category: 'obst', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Kirschen (Glas)', category: 'obst', unit: 'kg', price_per_unit: 5.90, price_unit: 'kg', supplier: '' },
  { name: 'Obst (saisonal/gemischt)', category: 'obst', unit: 'kg', price_per_unit: 4.50, price_unit: 'kg', supplier: '' },
  { name: 'Rosinen', category: 'obst', unit: 'kg', price_per_unit: 6.90, price_unit: 'kg', supplier: '' },

  // --- TIEFKÜHLWARE ---
  { name: 'TK-Erbsen', category: 'tiefkuehl', unit: 'kg', price_per_unit: 2.90, price_unit: 'kg', supplier: '' },
  { name: 'TK-Fisolen', category: 'tiefkuehl', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'TK-Buttergemüse', category: 'tiefkuehl', unit: 'kg', price_per_unit: 3.90, price_unit: 'kg', supplier: '' },
  { name: 'TK-Spinat', category: 'tiefkuehl', unit: 'kg', price_per_unit: 2.90, price_unit: 'kg', supplier: '' },
  { name: 'TK-Pommes', category: 'tiefkuehl', unit: 'kg', price_per_unit: 2.50, price_unit: 'kg', supplier: '' },
  { name: 'TK-Kroketten', category: 'tiefkuehl', unit: 'kg', price_per_unit: 3.50, price_unit: 'kg', supplier: '' },
  { name: 'Vanilleeis', category: 'tiefkuehl', unit: 'l', price_per_unit: 5.90, price_unit: 'l', supplier: '' },

  // --- SONSTIGES ---
  { name: 'Semmeln (altbacken)', category: 'sonstiges', unit: 'stueck', price_per_unit: 0.30, price_unit: 'stueck', supplier: '' },
  { name: 'Suppenwürfel', category: 'sonstiges', unit: 'stueck', price_per_unit: 0.25, price_unit: 'stueck', supplier: '' },
  { name: 'Essig (Weinessig)', category: 'sonstiges', unit: 'l', price_per_unit: 3.50, price_unit: 'l', supplier: '' },
  { name: 'Senf', category: 'sonstiges', unit: 'kg', price_per_unit: 4.90, price_unit: 'kg', supplier: '' },
  { name: 'Kren (Meerrettich)', category: 'sonstiges', unit: 'kg', price_per_unit: 8.90, price_unit: 'kg', supplier: '' },
  { name: 'Tomatenmark', category: 'sonstiges', unit: 'kg', price_per_unit: 4.50, price_unit: 'kg', supplier: '' },
  { name: 'Obers (Kokosmilch)', category: 'sonstiges', unit: 'l', price_per_unit: 3.50, price_unit: 'l', supplier: '' },
  { name: 'Rindssuppe (Fond)', category: 'sonstiges', unit: 'l', price_per_unit: 3.90, price_unit: 'l', supplier: '' },
  { name: 'Gemüsebrühe (Fond)', category: 'sonstiges', unit: 'l', price_per_unit: 2.90, price_unit: 'l', supplier: '' },
  { name: 'Wein (weiß, zum Kochen)', category: 'sonstiges', unit: 'l', price_per_unit: 4.90, price_unit: 'l', supplier: '' },
  { name: 'Rum', category: 'sonstiges', unit: 'l', price_per_unit: 12.90, price_unit: 'l', supplier: '' },
  { name: 'Biskotten (Löffelbiskuit)', category: 'sonstiges', unit: 'kg', price_per_unit: 6.90, price_unit: 'kg', supplier: '' },
  { name: 'Espresso (Kaffee)', category: 'sonstiges', unit: 'kg', price_per_unit: 15.90, price_unit: 'kg', supplier: '' },
];

// =====================================================================
// REZEPT-ITEMS (Zutat pro Gericht, Menge pro Person)
// =====================================================================

const RECIPE_ITEMS: RecipeItemSeed[] = [
  // =====================================================================
  // SUPPEN (23 Stück) - Mengen pro Person
  // =====================================================================
  // Rindsuppe mit Frittaten
  { dish: 'Rindsuppe mit Frittaten', ingredient: 'Rindfleisch', quantity: 50, unit: 'g', note: 'Suppenfleisch' },
  { dish: 'Rindsuppe mit Frittaten', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Rindsuppe mit Frittaten', ingredient: 'Sellerie', quantity: 20, unit: 'g', note: '' },
  { dish: 'Rindsuppe mit Frittaten', ingredient: 'Lauch', quantity: 15, unit: 'g', note: '' },
  { dish: 'Rindsuppe mit Frittaten', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: 'für Frittaten' },
  { dish: 'Rindsuppe mit Frittaten', ingredient: 'Mehl (glatt)', quantity: 20, unit: 'g', note: 'für Frittaten' },
  { dish: 'Rindsuppe mit Frittaten', ingredient: 'Milch', quantity: 30, unit: 'ml', note: 'für Frittaten' },

  // Frittatensuppe
  { dish: 'Frittatensuppe', ingredient: 'Rindssuppe (Fond)', quantity: 250, unit: 'ml', note: '' },
  { dish: 'Frittatensuppe', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Frittatensuppe', ingredient: 'Mehl (glatt)', quantity: 20, unit: 'g', note: '' },
  { dish: 'Frittatensuppe', ingredient: 'Milch', quantity: 30, unit: 'ml', note: '' },

  // Grießnockerlsuppe
  { dish: 'Grießnockerlsuppe', ingredient: 'Rindssuppe (Fond)', quantity: 250, unit: 'ml', note: '' },
  { dish: 'Grießnockerlsuppe', ingredient: 'Grieß', quantity: 25, unit: 'g', note: '' },
  { dish: 'Grießnockerlsuppe', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },
  { dish: 'Grießnockerlsuppe', ingredient: 'Eier', quantity: 0.3, unit: 'stueck', note: '' },

  // Leberknödelsuppe
  { dish: 'Leberknödelsuppe', ingredient: 'Rindssuppe (Fond)', quantity: 250, unit: 'ml', note: '' },
  { dish: 'Leberknödelsuppe', ingredient: 'Leber (Kalb)', quantity: 30, unit: 'g', note: '' },
  { dish: 'Leberknödelsuppe', ingredient: 'Semmeln (altbacken)', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Leberknödelsuppe', ingredient: 'Eier', quantity: 0.3, unit: 'stueck', note: '' },
  { dish: 'Leberknödelsuppe', ingredient: 'Petersilie', quantity: 2, unit: 'g', note: '' },

  // Backerbsensuppe
  { dish: 'Backerbsensuppe', ingredient: 'Rindssuppe (Fond)', quantity: 250, unit: 'ml', note: '' },
  { dish: 'Backerbsensuppe', ingredient: 'Mehl (glatt)', quantity: 20, unit: 'g', note: '' },
  { dish: 'Backerbsensuppe', ingredient: 'Eier', quantity: 0.3, unit: 'stueck', note: '' },

  // Nudelsuppe
  { dish: 'Nudelsuppe', ingredient: 'Rindssuppe (Fond)', quantity: 250, unit: 'ml', note: '' },
  { dish: 'Nudelsuppe', ingredient: 'Suppennudeln', quantity: 25, unit: 'g', note: '' },

  // Kürbiscremesuppe
  { dish: 'Kürbiscremesuppe', ingredient: 'Kürbis', quantity: 150, unit: 'g', note: '' },
  { dish: 'Kürbiscremesuppe', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Kürbiscremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Kürbiscremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },
  { dish: 'Kürbiscremesuppe', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Kartoffelcremesuppe
  { dish: 'Kartoffelcremesuppe', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },
  { dish: 'Kartoffelcremesuppe', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Kartoffelcremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Kartoffelcremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },
  { dish: 'Kartoffelcremesuppe', ingredient: 'Muskatnuss', quantity: 1, unit: 'g', note: '' },

  // Tomatencremesuppe
  { dish: 'Tomatencremesuppe', ingredient: 'Tomaten (Dose/passiert)', quantity: 150, unit: 'g', note: '' },
  { dish: 'Tomatencremesuppe', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Tomatencremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Tomatencremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 150, unit: 'ml', note: '' },
  { dish: 'Tomatencremesuppe', ingredient: 'Basilikum', quantity: 2, unit: 'g', note: '' },

  // Spargelcremesuppe
  { dish: 'Spargelcremesuppe', ingredient: 'Spargel', quantity: 120, unit: 'g', note: '' },
  { dish: 'Spargelcremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Spargelcremesuppe', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },
  { dish: 'Spargelcremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Karottencremesuppe
  { dish: 'Karottencremesuppe', ingredient: 'Karotten', quantity: 150, unit: 'g', note: '' },
  { dish: 'Karottencremesuppe', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Karottencremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Karottencremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Gemüsesuppe
  { dish: 'Gemüsesuppe', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüsesuppe', ingredient: 'Sellerie', quantity: 20, unit: 'g', note: '' },
  { dish: 'Gemüsesuppe', ingredient: 'Lauch', quantity: 15, unit: 'g', note: '' },
  { dish: 'Gemüsesuppe', ingredient: 'Kartoffeln', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüsesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 250, unit: 'ml', note: '' },

  // Minestrone
  { dish: 'Minestrone', ingredient: 'Karotten', quantity: 25, unit: 'g', note: '' },
  { dish: 'Minestrone', ingredient: 'Zucchini', quantity: 25, unit: 'g', note: '' },
  { dish: 'Minestrone', ingredient: 'Sellerie', quantity: 15, unit: 'g', note: '' },
  { dish: 'Minestrone', ingredient: 'Tomaten (Dose/passiert)', quantity: 50, unit: 'g', note: '' },
  { dish: 'Minestrone', ingredient: 'Suppennudeln', quantity: 15, unit: 'g', note: '' },
  { dish: 'Minestrone', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Brokkolicremesuppe
  { dish: 'Brokkolicremesuppe', ingredient: 'Brokkoli', quantity: 150, unit: 'g', note: '' },
  { dish: 'Brokkolicremesuppe', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Brokkolicremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Brokkolicremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Erbsencremesuppe
  { dish: 'Erbsencremesuppe', ingredient: 'Erbsen (frisch/TK)', quantity: 120, unit: 'g', note: '' },
  { dish: 'Erbsencremesuppe', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Erbsencremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Erbsencremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Knoblauchcremesuppe
  { dish: 'Knoblauchcremesuppe', ingredient: 'Knoblauch', quantity: 20, unit: 'g', note: '' },
  { dish: 'Knoblauchcremesuppe', ingredient: 'Kartoffeln', quantity: 80, unit: 'g', note: '' },
  { dish: 'Knoblauchcremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Knoblauchcremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Zwiebelsuppe
  { dish: 'Zwiebelsuppe', ingredient: 'Zwiebeln', quantity: 100, unit: 'g', note: '' },
  { dish: 'Zwiebelsuppe', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Zwiebelsuppe', ingredient: 'Mehl (glatt)', quantity: 10, unit: 'g', note: '' },
  { dish: 'Zwiebelsuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 250, unit: 'ml', note: '' },

  // Klare Gemüsebrühe mit Einlage
  { dish: 'Klare Gemüsebrühe mit Einlage', ingredient: 'Gemüsebrühe (Fond)', quantity: 250, unit: 'ml', note: '' },
  { dish: 'Klare Gemüsebrühe mit Einlage', ingredient: 'Karotten', quantity: 20, unit: 'g', note: 'Einlage' },
  { dish: 'Klare Gemüsebrühe mit Einlage', ingredient: 'Eier', quantity: 0.3, unit: 'stueck', note: 'Eierstich' },

  // Gulaschsuppe
  { dish: 'Gulaschsuppe', ingredient: 'Rindsgulaschfleisch', quantity: 60, unit: 'g', note: '' },
  { dish: 'Gulaschsuppe', ingredient: 'Zwiebeln', quantity: 40, unit: 'g', note: '' },
  { dish: 'Gulaschsuppe', ingredient: 'Paprikapulver (edelsüß)', quantity: 3, unit: 'g', note: '' },
  { dish: 'Gulaschsuppe', ingredient: 'Tomatenmark', quantity: 10, unit: 'g', note: '' },
  { dish: 'Gulaschsuppe', ingredient: 'Kartoffeln', quantity: 40, unit: 'g', note: '' },

  // Schwammerlcremesuppe
  { dish: 'Schwammerlcremesuppe', ingredient: 'Champignons', quantity: 120, unit: 'g', note: '' },
  { dish: 'Schwammerlcremesuppe', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Schwammerlcremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Schwammerlcremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Selleriecremesuppe
  { dish: 'Selleriecremesuppe', ingredient: 'Sellerie', quantity: 120, unit: 'g', note: '' },
  { dish: 'Selleriecremesuppe', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Selleriecremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Selleriecremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Lauchcremesuppe
  { dish: 'Lauchcremesuppe', ingredient: 'Lauch', quantity: 120, unit: 'g', note: '' },
  { dish: 'Lauchcremesuppe', ingredient: 'Kartoffeln', quantity: 50, unit: 'g', note: '' },
  { dish: 'Lauchcremesuppe', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Lauchcremesuppe', ingredient: 'Gemüsebrühe (Fond)', quantity: 200, unit: 'ml', note: '' },

  // Kaspressknödelsuppe
  { dish: 'Kaspressknödelsuppe', ingredient: 'Rindssuppe (Fond)', quantity: 250, unit: 'ml', note: '' },
  { dish: 'Kaspressknödelsuppe', ingredient: 'Semmeln (altbacken)', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Kaspressknödelsuppe', ingredient: 'Gouda', quantity: 25, unit: 'g', note: '' },
  { dish: 'Kaspressknödelsuppe', ingredient: 'Eier', quantity: 0.3, unit: 'stueck', note: '' },
  { dish: 'Kaspressknödelsuppe', ingredient: 'Zwiebeln', quantity: 15, unit: 'g', note: '' },

  // =====================================================================
  // FLEISCHGERICHTE Teil 1 (21 Stück)
  // =====================================================================
  // Wiener Schnitzel
  { dish: 'Wiener Schnitzel', ingredient: 'Kalbfleisch', quantity: 180, unit: 'g', note: 'Schnitzel' },
  { dish: 'Wiener Schnitzel', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Wiener Schnitzel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Wiener Schnitzel', ingredient: 'Semmelbrösel', quantity: 25, unit: 'g', note: '' },
  { dish: 'Wiener Schnitzel', ingredient: 'Butterschmalz', quantity: 30, unit: 'g', note: 'zum Backen' },

  // Schnitzel vom Schwein
  { dish: 'Schnitzel vom Schwein', ingredient: 'Schweinsschnitzel', quantity: 180, unit: 'g', note: '' },
  { dish: 'Schnitzel vom Schwein', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Schnitzel vom Schwein', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Schnitzel vom Schwein', ingredient: 'Semmelbrösel', quantity: 25, unit: 'g', note: '' },
  { dish: 'Schnitzel vom Schwein', ingredient: 'Pflanzenöl', quantity: 30, unit: 'ml', note: '' },

  // Pariser Schnitzel
  { dish: 'Pariser Schnitzel', ingredient: 'Schweinsschnitzel', quantity: 180, unit: 'g', note: '' },
  { dish: 'Pariser Schnitzel', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Pariser Schnitzel', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Pariser Schnitzel', ingredient: 'Pflanzenöl', quantity: 30, unit: 'ml', note: '' },

  // Naturschnitzel vom Schwein
  { dish: 'Naturschnitzel vom Schwein', ingredient: 'Schweinsschnitzel', quantity: 180, unit: 'g', note: '' },
  { dish: 'Naturschnitzel vom Schwein', ingredient: 'Mehl (glatt)', quantity: 10, unit: 'g', note: '' },
  { dish: 'Naturschnitzel vom Schwein', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Naturschnitzel vom Schwein', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: 'Sauce' },
  { dish: 'Naturschnitzel vom Schwein', ingredient: 'Wein (weiß, zum Kochen)', quantity: 20, unit: 'ml', note: '' },

  // Putenschnitzel
  { dish: 'Putenschnitzel', ingredient: 'Putenschnitzel', quantity: 180, unit: 'g', note: '' },
  { dish: 'Putenschnitzel', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Putenschnitzel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Putenschnitzel', ingredient: 'Semmelbrösel', quantity: 25, unit: 'g', note: '' },
  { dish: 'Putenschnitzel', ingredient: 'Pflanzenöl', quantity: 30, unit: 'ml', note: '' },

  // Schweinsbraten
  { dish: 'Schweinsbraten', ingredient: 'Schweinefleisch', quantity: 200, unit: 'g', note: 'Schulter/Bauch' },
  { dish: 'Schweinsbraten', ingredient: 'Zwiebeln', quantity: 30, unit: 'g', note: '' },
  { dish: 'Schweinsbraten', ingredient: 'Kümmel', quantity: 2, unit: 'g', note: '' },
  { dish: 'Schweinsbraten', ingredient: 'Knoblauch', quantity: 3, unit: 'g', note: '' },
  { dish: 'Schweinsbraten', ingredient: 'Rindssuppe (Fond)', quantity: 50, unit: 'ml', note: 'Bratensaft' },

  // Rinderbraten
  { dish: 'Rinderbraten', ingredient: 'Rindfleisch', quantity: 200, unit: 'g', note: '' },
  { dish: 'Rinderbraten', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Rinderbraten', ingredient: 'Zwiebeln', quantity: 30, unit: 'g', note: '' },
  { dish: 'Rinderbraten', ingredient: 'Sellerie', quantity: 20, unit: 'g', note: '' },
  { dish: 'Rinderbraten', ingredient: 'Rindssuppe (Fond)', quantity: 80, unit: 'ml', note: '' },
  { dish: 'Rinderbraten', ingredient: 'Wein (weiß, zum Kochen)', quantity: 20, unit: 'ml', note: '' },

  // Rindsgulasch
  { dish: 'Rindsgulasch', ingredient: 'Rindsgulaschfleisch', quantity: 200, unit: 'g', note: '' },
  { dish: 'Rindsgulasch', ingredient: 'Zwiebeln', quantity: 80, unit: 'g', note: '' },
  { dish: 'Rindsgulasch', ingredient: 'Paprikapulver (edelsüß)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Rindsgulasch', ingredient: 'Tomatenmark', quantity: 10, unit: 'g', note: '' },
  { dish: 'Rindsgulasch', ingredient: 'Kümmel', quantity: 1, unit: 'g', note: '' },

  // Rindsgeschnetzeltes
  { dish: 'Rindsgeschnetzeltes', ingredient: 'Rindfleisch', quantity: 180, unit: 'g', note: 'geschnitten' },
  { dish: 'Rindsgeschnetzeltes', ingredient: 'Champignons', quantity: 40, unit: 'g', note: '' },
  { dish: 'Rindsgeschnetzeltes', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Rindsgeschnetzeltes', ingredient: 'Zwiebeln', quantity: 25, unit: 'g', note: '' },
  { dish: 'Rindsgeschnetzeltes', ingredient: 'Wein (weiß, zum Kochen)', quantity: 20, unit: 'ml', note: '' },

  // Tafelspitz
  { dish: 'Tafelspitz', ingredient: 'Tafelspitz (Rind)', quantity: 220, unit: 'g', note: '' },
  { dish: 'Tafelspitz', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Tafelspitz', ingredient: 'Sellerie', quantity: 20, unit: 'g', note: '' },
  { dish: 'Tafelspitz', ingredient: 'Lauch', quantity: 15, unit: 'g', note: '' },
  { dish: 'Tafelspitz', ingredient: 'Schnittlauch', quantity: 3, unit: 'g', note: '' },

  // Zwiebelrostbraten
  { dish: 'Zwiebelrostbraten', ingredient: 'Rindfleisch', quantity: 200, unit: 'g', note: 'Rostbraten' },
  { dish: 'Zwiebelrostbraten', ingredient: 'Zwiebeln', quantity: 60, unit: 'g', note: 'Röstzwiebel' },
  { dish: 'Zwiebelrostbraten', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Zwiebelrostbraten', ingredient: 'Pflanzenöl', quantity: 20, unit: 'ml', note: '' },
  { dish: 'Zwiebelrostbraten', ingredient: 'Senf', quantity: 5, unit: 'g', note: '' },
  { dish: 'Zwiebelrostbraten', ingredient: 'Rindssuppe (Fond)', quantity: 40, unit: 'ml', note: 'Sauce' },

  // Schweinefilet
  { dish: 'Schweinefilet', ingredient: 'Schweinefilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Schweinefilet', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: 'Sauce' },
  { dish: 'Schweinefilet', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Schweinefilet', ingredient: 'Wein (weiß, zum Kochen)', quantity: 20, unit: 'ml', note: '' },

  // Hühnerfilet
  { dish: 'Hühnerfilet', ingredient: 'Hühnerbrust', quantity: 180, unit: 'g', note: '' },
  { dish: 'Hühnerfilet', ingredient: 'Olivenöl', quantity: 10, unit: 'ml', note: '' },
  { dish: 'Hühnerfilet', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Hühnerstreifen
  { dish: 'Hühnerstreifen', ingredient: 'Hühnerbrust', quantity: 180, unit: 'g', note: 'in Streifen' },
  { dish: 'Hühnerstreifen', ingredient: 'Paprika', quantity: 30, unit: 'g', note: '' },
  { dish: 'Hühnerstreifen', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Hühnerstreifen', ingredient: 'Pflanzenöl', quantity: 15, unit: 'ml', note: '' },

  // Hühnergeschnetzeltes
  { dish: 'Hühnergeschnetzeltes', ingredient: 'Hühnerbrust', quantity: 180, unit: 'g', note: '' },
  { dish: 'Hühnergeschnetzeltes', ingredient: 'Champignons', quantity: 40, unit: 'g', note: '' },
  { dish: 'Hühnergeschnetzeltes', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Hühnergeschnetzeltes', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },

  // Puten-Rahmgeschnetzeltes
  { dish: 'Puten-Rahmgeschnetzeltes', ingredient: 'Putenfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Puten-Rahmgeschnetzeltes', ingredient: 'Sahne (Schlagobers)', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Puten-Rahmgeschnetzeltes', ingredient: 'Champignons', quantity: 30, unit: 'g', note: '' },
  { dish: 'Puten-Rahmgeschnetzeltes', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },

  // Gemüse-Hühnercurry
  { dish: 'Gemüse-Hühnercurry', ingredient: 'Hühnerbrust', quantity: 150, unit: 'g', note: '' },
  { dish: 'Gemüse-Hühnercurry', ingredient: 'Paprika', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüse-Hühnercurry', ingredient: 'Zucchini', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüse-Hühnercurry', ingredient: 'Obers (Kokosmilch)', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Gemüse-Hühnercurry', ingredient: 'Currypulver', quantity: 3, unit: 'g', note: '' },

  // Korma-Hühnerkeule
  { dish: 'Korma-Hühnerkeule', ingredient: 'Hühnerkeulen', quantity: 220, unit: 'g', note: '' },
  { dish: 'Korma-Hühnerkeule', ingredient: 'Joghurt (natur)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Korma-Hühnerkeule', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Korma-Hühnerkeule', ingredient: 'Currypulver', quantity: 3, unit: 'g', note: '' },
  { dish: 'Korma-Hühnerkeule', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },

  // Spaghetti Bolognese
  { dish: 'Spaghetti Bolognese', ingredient: 'Faschiertes (Rind/Schwein)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Spaghetti Bolognese', ingredient: 'Nudeln (Spaghetti)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Spaghetti Bolognese', ingredient: 'Tomaten (Dose/passiert)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Spaghetti Bolognese', ingredient: 'Zwiebeln', quantity: 25, unit: 'g', note: '' },
  { dish: 'Spaghetti Bolognese', ingredient: 'Karotten', quantity: 15, unit: 'g', note: '' },
  { dish: 'Spaghetti Bolognese', ingredient: 'Sellerie', quantity: 10, unit: 'g', note: '' },
  { dish: 'Spaghetti Bolognese', ingredient: 'Parmesan', quantity: 10, unit: 'g', note: '' },

  // Cevapcici
  { dish: 'Cevapcici', ingredient: 'Faschiertes (Rind/Schwein)', quantity: 180, unit: 'g', note: '' },
  { dish: 'Cevapcici', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Cevapcici', ingredient: 'Knoblauch', quantity: 3, unit: 'g', note: '' },
  { dish: 'Cevapcici', ingredient: 'Paprikapulver (edelsüß)', quantity: 2, unit: 'g', note: '' },

  // =====================================================================
  // FLEISCHGERICHTE Teil 2 (21 Stück)
  // =====================================================================
  // Faschierte Laibchen
  { dish: 'Faschierte Laibchen', ingredient: 'Faschiertes (Rind/Schwein)', quantity: 180, unit: 'g', note: '' },
  { dish: 'Faschierte Laibchen', ingredient: 'Semmeln (altbacken)', quantity: 1, unit: 'stueck', note: 'eingeweicht' },
  { dish: 'Faschierte Laibchen', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Faschierte Laibchen', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Faschierte Laibchen', ingredient: 'Senf', quantity: 5, unit: 'g', note: '' },

  // Paprikahendl
  { dish: 'Paprikahendl', ingredient: 'Hühnerkeulen', quantity: 220, unit: 'g', note: '' },
  { dish: 'Paprikahendl', ingredient: 'Paprika', quantity: 40, unit: 'g', note: '' },
  { dish: 'Paprikahendl', ingredient: 'Zwiebeln', quantity: 30, unit: 'g', note: '' },
  { dish: 'Paprikahendl', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Paprikahendl', ingredient: 'Paprikapulver (edelsüß)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Paprikahendl', ingredient: 'Tomatenmark', quantity: 10, unit: 'g', note: '' },

  // Geselchtes mit Sauerkraut
  { dish: 'Geselchtes mit Sauerkraut', ingredient: 'Geselchtes', quantity: 200, unit: 'g', note: '' },
  { dish: 'Geselchtes mit Sauerkraut', ingredient: 'Sauerkraut', quantity: 150, unit: 'g', note: '' },
  { dish: 'Geselchtes mit Sauerkraut', ingredient: 'Kümmel', quantity: 2, unit: 'g', note: '' },

  // Schweinshaxe
  { dish: 'Schweinshaxe', ingredient: 'Schweinshaxe', quantity: 300, unit: 'g', note: '' },
  { dish: 'Schweinshaxe', ingredient: 'Kümmel', quantity: 2, unit: 'g', note: '' },
  { dish: 'Schweinshaxe', ingredient: 'Knoblauch', quantity: 3, unit: 'g', note: '' },
  { dish: 'Schweinshaxe', ingredient: 'Rindssuppe (Fond)', quantity: 50, unit: 'ml', note: 'Bratensaft' },

  // Putenrollbraten
  { dish: 'Putenrollbraten', ingredient: 'Putenfilet', quantity: 200, unit: 'g', note: '' },
  { dish: 'Putenrollbraten', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: 'Sauce' },
  { dish: 'Putenrollbraten', ingredient: 'Karotten', quantity: 20, unit: 'g', note: '' },
  { dish: 'Putenrollbraten', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },

  // Hühnerkeulen überbacken
  { dish: 'Hühnerkeulen überbacken', ingredient: 'Hühnerkeulen', quantity: 220, unit: 'g', note: '' },
  { dish: 'Hühnerkeulen überbacken', ingredient: 'Gouda', quantity: 25, unit: 'g', note: '' },
  { dish: 'Hühnerkeulen überbacken', ingredient: 'Semmelbrösel', quantity: 15, unit: 'g', note: '' },
  { dish: 'Hühnerkeulen überbacken', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },

  // Geschnetzeltes Zürcher Art
  { dish: 'Geschnetzeltes Zürcher Art', ingredient: 'Kalbfleisch', quantity: 180, unit: 'g', note: 'geschnitten' },
  { dish: 'Geschnetzeltes Zürcher Art', ingredient: 'Champignons', quantity: 40, unit: 'g', note: '' },
  { dish: 'Geschnetzeltes Zürcher Art', ingredient: 'Sahne (Schlagobers)', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Geschnetzeltes Zürcher Art', ingredient: 'Wein (weiß, zum Kochen)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Geschnetzeltes Zürcher Art', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },

  // Fleischknödel
  { dish: 'Fleischknödel', ingredient: 'Faschiertes (Rind/Schwein)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Fleischknödel', ingredient: 'Semmeln (altbacken)', quantity: 2, unit: 'stueck', note: '' },
  { dish: 'Fleischknödel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Fleischknödel', ingredient: 'Milch', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Fleischknödel', ingredient: 'Petersilie', quantity: 3, unit: 'g', note: '' },

  // Steirisches Wurzelfleisch
  { dish: 'Steirisches Wurzelfleisch', ingredient: 'Schweinefleisch', quantity: 200, unit: 'g', note: '' },
  { dish: 'Steirisches Wurzelfleisch', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Steirisches Wurzelfleisch', ingredient: 'Sellerie', quantity: 20, unit: 'g', note: '' },
  { dish: 'Steirisches Wurzelfleisch', ingredient: 'Kren (Meerrettich)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Steirisches Wurzelfleisch', ingredient: 'Essig (Weinessig)', quantity: 10, unit: 'ml', note: '' },

  // Hühner-Gemüse-Pfanne
  { dish: 'Hühner-Gemüse-Pfanne', ingredient: 'Hühnerbrust', quantity: 150, unit: 'g', note: '' },
  { dish: 'Hühner-Gemüse-Pfanne', ingredient: 'Paprika', quantity: 40, unit: 'g', note: '' },
  { dish: 'Hühner-Gemüse-Pfanne', ingredient: 'Zucchini', quantity: 40, unit: 'g', note: '' },
  { dish: 'Hühner-Gemüse-Pfanne', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Hühner-Gemüse-Pfanne', ingredient: 'Pflanzenöl', quantity: 15, unit: 'ml', note: '' },

  // Puten-Curry
  { dish: 'Puten-Curry', ingredient: 'Putenfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Puten-Curry', ingredient: 'Obers (Kokosmilch)', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Puten-Curry', ingredient: 'Currypulver', quantity: 3, unit: 'g', note: '' },
  { dish: 'Puten-Curry', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Puten-Curry', ingredient: 'Paprika', quantity: 30, unit: 'g', note: '' },

  // Rindsroulade
  { dish: 'Rindsroulade', ingredient: 'Rindfleisch', quantity: 200, unit: 'g', note: 'dünn geschnitten' },
  { dish: 'Rindsroulade', ingredient: 'Senf', quantity: 5, unit: 'g', note: '' },
  { dish: 'Rindsroulade', ingredient: 'Speck', quantity: 20, unit: 'g', note: '' },
  { dish: 'Rindsroulade', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Rindsroulade', ingredient: 'Gurke', quantity: 15, unit: 'g', note: 'Essiggurke' },
  { dish: 'Rindsroulade', ingredient: 'Rindssuppe (Fond)', quantity: 60, unit: 'ml', note: 'Sauce' },

  // Backhendl
  { dish: 'Backhendl', ingredient: 'Hühnerkeulen', quantity: 220, unit: 'g', note: '' },
  { dish: 'Backhendl', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Backhendl', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Backhendl', ingredient: 'Semmelbrösel', quantity: 25, unit: 'g', note: '' },
  { dish: 'Backhendl', ingredient: 'Pflanzenöl', quantity: 40, unit: 'ml', note: '' },

  // Cordon Bleu
  { dish: 'Cordon Bleu', ingredient: 'Schweinsschnitzel', quantity: 180, unit: 'g', note: '' },
  { dish: 'Cordon Bleu', ingredient: 'Schinken (gekocht)', quantity: 30, unit: 'g', note: '' },
  { dish: 'Cordon Bleu', ingredient: 'Gouda', quantity: 30, unit: 'g', note: '' },
  { dish: 'Cordon Bleu', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Cordon Bleu', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Cordon Bleu', ingredient: 'Semmelbrösel', quantity: 25, unit: 'g', note: '' },

  // Jägerschnitzel
  { dish: 'Jägerschnitzel', ingredient: 'Schweinsschnitzel', quantity: 180, unit: 'g', note: '' },
  { dish: 'Jägerschnitzel', ingredient: 'Champignons', quantity: 50, unit: 'g', note: '' },
  { dish: 'Jägerschnitzel', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Jägerschnitzel', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },

  // Rahmschnitzel
  { dish: 'Rahmschnitzel', ingredient: 'Schweinsschnitzel', quantity: 180, unit: 'g', note: '' },
  { dish: 'Rahmschnitzel', ingredient: 'Sahne (Schlagobers)', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Rahmschnitzel', ingredient: 'Mehl (glatt)', quantity: 10, unit: 'g', note: '' },
  { dish: 'Rahmschnitzel', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },

  // Kümmelbraten
  { dish: 'Kümmelbraten', ingredient: 'Schweinefleisch', quantity: 200, unit: 'g', note: '' },
  { dish: 'Kümmelbraten', ingredient: 'Kümmel', quantity: 3, unit: 'g', note: '' },
  { dish: 'Kümmelbraten', ingredient: 'Knoblauch', quantity: 3, unit: 'g', note: '' },
  { dish: 'Kümmelbraten', ingredient: 'Zwiebeln', quantity: 25, unit: 'g', note: '' },
  { dish: 'Kümmelbraten', ingredient: 'Rindssuppe (Fond)', quantity: 50, unit: 'ml', note: '' },

  // Reisfleisch
  { dish: 'Reisfleisch', ingredient: 'Schweinefleisch', quantity: 120, unit: 'g', note: '' },
  { dish: 'Reisfleisch', ingredient: 'Reis (Langkorn)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Reisfleisch', ingredient: 'Zwiebeln', quantity: 25, unit: 'g', note: '' },
  { dish: 'Reisfleisch', ingredient: 'Paprikapulver (edelsüß)', quantity: 3, unit: 'g', note: '' },
  { dish: 'Reisfleisch', ingredient: 'Tomatenmark', quantity: 10, unit: 'g', note: '' },

  // Leberkäse
  { dish: 'Leberkäse', ingredient: 'Leberkäse', quantity: 200, unit: 'g', note: '' },

  // Beuschel
  { dish: 'Beuschel', ingredient: 'Innereien (Beuschel)', quantity: 200, unit: 'g', note: '' },
  { dish: 'Beuschel', ingredient: 'Zwiebeln', quantity: 25, unit: 'g', note: '' },
  { dish: 'Beuschel', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Beuschel', ingredient: 'Essig (Weinessig)', quantity: 10, unit: 'ml', note: '' },
  { dish: 'Beuschel', ingredient: 'Lorbeerblätter', quantity: 1, unit: 'g', note: '' },

  // Kalbsgulasch
  { dish: 'Kalbsgulasch', ingredient: 'Kalbfleisch', quantity: 200, unit: 'g', note: '' },
  { dish: 'Kalbsgulasch', ingredient: 'Zwiebeln', quantity: 60, unit: 'g', note: '' },
  { dish: 'Kalbsgulasch', ingredient: 'Paprikapulver (edelsüß)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Kalbsgulasch', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Kalbsgulasch', ingredient: 'Tomatenmark', quantity: 10, unit: 'g', note: '' },

  // Gebackene Leber
  { dish: 'Gebackene Leber', ingredient: 'Leber (Kalb)', quantity: 180, unit: 'g', note: '' },
  { dish: 'Gebackene Leber', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Gebackene Leber', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Gebackene Leber', ingredient: 'Semmelbrösel', quantity: 20, unit: 'g', note: '' },
  { dish: 'Gebackene Leber', ingredient: 'Pflanzenöl', quantity: 30, unit: 'ml', note: '' },

  // =====================================================================
  // FISCHGERICHTE (14 Stück)
  // =====================================================================
  // Lachsfilet
  { dish: 'Lachsfilet', ingredient: 'Lachsfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Lachsfilet', ingredient: 'Olivenöl', quantity: 10, unit: 'ml', note: '' },
  { dish: 'Lachsfilet', ingredient: 'Zitronen', quantity: 15, unit: 'g', note: 'Saft' },
  { dish: 'Lachsfilet', ingredient: 'Dill', quantity: 2, unit: 'g', note: '' },

  // Seehechtfilet
  { dish: 'Seehechtfilet', ingredient: 'Seehechtfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Seehechtfilet', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Seehechtfilet', ingredient: 'Zitronen', quantity: 15, unit: 'g', note: '' },

  // Seelachsfilet gebacken
  { dish: 'Seelachsfilet gebacken', ingredient: 'Seelachsfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Seelachsfilet gebacken', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Seelachsfilet gebacken', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Seelachsfilet gebacken', ingredient: 'Semmelbrösel', quantity: 25, unit: 'g', note: '' },
  { dish: 'Seelachsfilet gebacken', ingredient: 'Pflanzenöl', quantity: 30, unit: 'ml', note: '' },

  // Fischstäbchen
  { dish: 'Fischstäbchen', ingredient: 'Fischstäbchen (TK)', quantity: 200, unit: 'g', note: '' },
  { dish: 'Fischstäbchen', ingredient: 'Pflanzenöl', quantity: 20, unit: 'ml', note: '' },

  // Seehecht gebraten
  { dish: 'Seehecht gebraten', ingredient: 'Seehechtfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Seehecht gebraten', ingredient: 'Mehl (glatt)', quantity: 10, unit: 'g', note: '' },
  { dish: 'Seehecht gebraten', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },

  // Forelle Müllerin
  { dish: 'Forelle Müllerin', ingredient: 'Forellenfilet', quantity: 200, unit: 'g', note: '' },
  { dish: 'Forelle Müllerin', ingredient: 'Mehl (glatt)', quantity: 10, unit: 'g', note: '' },
  { dish: 'Forelle Müllerin', ingredient: 'Butter', quantity: 20, unit: 'g', note: '' },
  { dish: 'Forelle Müllerin', ingredient: 'Zitronen', quantity: 15, unit: 'g', note: '' },
  { dish: 'Forelle Müllerin', ingredient: 'Petersilie', quantity: 3, unit: 'g', note: '' },

  // Zanderfilet auf Gemüsebett
  { dish: 'Zanderfilet auf Gemüsebett', ingredient: 'Zanderfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Zanderfilet auf Gemüsebett', ingredient: 'Zucchini', quantity: 40, unit: 'g', note: '' },
  { dish: 'Zanderfilet auf Gemüsebett', ingredient: 'Paprika', quantity: 30, unit: 'g', note: '' },
  { dish: 'Zanderfilet auf Gemüsebett', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Zanderfilet auf Gemüsebett', ingredient: 'Olivenöl', quantity: 10, unit: 'ml', note: '' },

  // Lachsforelle mit Kräuterkruste
  { dish: 'Lachsforelle mit Kräuterkruste', ingredient: 'Lachsforellenfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Lachsforelle mit Kräuterkruste', ingredient: 'Semmelbrösel', quantity: 20, unit: 'g', note: '' },
  { dish: 'Lachsforelle mit Kräuterkruste', ingredient: 'Petersilie', quantity: 3, unit: 'g', note: '' },
  { dish: 'Lachsforelle mit Kräuterkruste', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },

  // Pangasiusfilet gedünstet
  { dish: 'Pangasiusfilet gedünstet', ingredient: 'Pangasiusfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Pangasiusfilet gedünstet', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },
  { dish: 'Pangasiusfilet gedünstet', ingredient: 'Dill', quantity: 2, unit: 'g', note: '' },
  { dish: 'Pangasiusfilet gedünstet', ingredient: 'Wein (weiß, zum Kochen)', quantity: 20, unit: 'ml', note: '' },

  // Fischfilet im Backteig
  { dish: 'Fischfilet im Backteig', ingredient: 'Seelachsfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Fischfilet im Backteig', ingredient: 'Mehl (glatt)', quantity: 30, unit: 'g', note: 'Backteig' },
  { dish: 'Fischfilet im Backteig', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Fischfilet im Backteig', ingredient: 'Pflanzenöl', quantity: 40, unit: 'ml', note: '' },

  // Thunfisch-Nudelpfanne
  { dish: 'Thunfisch-Nudelpfanne', ingredient: 'Thunfisch (Dose)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Thunfisch-Nudelpfanne', ingredient: 'Nudeln (Spaghetti)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Thunfisch-Nudelpfanne', ingredient: 'Tomaten (Dose/passiert)', quantity: 60, unit: 'g', note: '' },
  { dish: 'Thunfisch-Nudelpfanne', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Thunfisch-Nudelpfanne', ingredient: 'Olivenöl', quantity: 10, unit: 'ml', note: '' },

  // Kabeljaufilet mit Senfkruste
  { dish: 'Kabeljaufilet mit Senfkruste', ingredient: 'Kabeljaufilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Kabeljaufilet mit Senfkruste', ingredient: 'Senf', quantity: 10, unit: 'g', note: '' },
  { dish: 'Kabeljaufilet mit Senfkruste', ingredient: 'Semmelbrösel', quantity: 15, unit: 'g', note: '' },
  { dish: 'Kabeljaufilet mit Senfkruste', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Karpfen gebacken
  { dish: 'Karpfen gebacken', ingredient: 'Karpfen', quantity: 220, unit: 'g', note: '' },
  { dish: 'Karpfen gebacken', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Karpfen gebacken', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Karpfen gebacken', ingredient: 'Semmelbrösel', quantity: 25, unit: 'g', note: '' },
  { dish: 'Karpfen gebacken', ingredient: 'Pflanzenöl', quantity: 30, unit: 'ml', note: '' },

  // Saibling gebraten
  { dish: 'Saibling gebraten', ingredient: 'Saiblingfilet', quantity: 180, unit: 'g', note: '' },
  { dish: 'Saibling gebraten', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Saibling gebraten', ingredient: 'Zitronen', quantity: 15, unit: 'g', note: '' },

  // =====================================================================
  // VEGETARISCHE GERICHTE Teil 1 (14 Stück)
  // =====================================================================
  // Käsespätzle
  { dish: 'Käsespätzle', ingredient: 'Mehl (griffig)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Käsespätzle', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Käsespätzle', ingredient: 'Emmentaler', quantity: 50, unit: 'g', note: '' },
  { dish: 'Käsespätzle', ingredient: 'Zwiebeln', quantity: 30, unit: 'g', note: 'Röstzwiebel' },
  { dish: 'Käsespätzle', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },

  // Spinat-Tortellini
  { dish: 'Spinat-Tortellini', ingredient: 'Tortellini', quantity: 150, unit: 'g', note: '' },
  { dish: 'Spinat-Tortellini', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Spinat-Tortellini', ingredient: 'Parmesan', quantity: 10, unit: 'g', note: '' },

  // Gemüse-Lasagne
  { dish: 'Gemüse-Lasagne', ingredient: 'Lasagneblätter', quantity: 60, unit: 'g', note: '' },
  { dish: 'Gemüse-Lasagne', ingredient: 'Zucchini', quantity: 50, unit: 'g', note: '' },
  { dish: 'Gemüse-Lasagne', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüse-Lasagne', ingredient: 'Tomaten (Dose/passiert)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Gemüse-Lasagne', ingredient: 'Mozzarella', quantity: 40, unit: 'g', note: '' },
  { dish: 'Gemüse-Lasagne', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: 'Béchamel' },

  // Pasta all'arrabbiata
  { dish: "Pasta all'arrabbiata", ingredient: 'Nudeln (Spaghetti)', quantity: 120, unit: 'g', note: '' },
  { dish: "Pasta all'arrabbiata", ingredient: 'Tomaten (Dose/passiert)', quantity: 100, unit: 'g', note: '' },
  { dish: "Pasta all'arrabbiata", ingredient: 'Knoblauch', quantity: 5, unit: 'g', note: '' },
  { dish: "Pasta all'arrabbiata", ingredient: 'Olivenöl', quantity: 15, unit: 'ml', note: '' },

  // Kasnudeln
  { dish: 'Kasnudeln', ingredient: 'Mehl (griffig)', quantity: 80, unit: 'g', note: 'Teig' },
  { dish: 'Kasnudeln', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Kasnudeln', ingredient: 'Topfen', quantity: 80, unit: 'g', note: 'Füllung' },
  { dish: 'Kasnudeln', ingredient: 'Kartoffeln', quantity: 50, unit: 'g', note: 'Füllung' },
  { dish: 'Kasnudeln', ingredient: 'Butter', quantity: 20, unit: 'g', note: 'braune Butter' },

  // Fruchtknödel
  { dish: 'Fruchtknödel', ingredient: 'Kartoffeln', quantity: 100, unit: 'g', note: 'Kartoffelteig' },
  { dish: 'Fruchtknödel', ingredient: 'Mehl (griffig)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Fruchtknödel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Fruchtknödel', ingredient: 'Obst (saisonal/gemischt)', quantity: 80, unit: 'g', note: 'Füllung' },
  { dish: 'Fruchtknödel', ingredient: 'Semmelbrösel', quantity: 20, unit: 'g', note: 'geröstet' },
  { dish: 'Fruchtknödel', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },

  // Spinat-Schafkäse-Strudel
  { dish: 'Spinat-Schafkäse-Strudel', ingredient: 'Strudelteig', quantity: 60, unit: 'g', note: '' },
  { dish: 'Spinat-Schafkäse-Strudel', ingredient: 'Spinat (frisch)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Spinat-Schafkäse-Strudel', ingredient: 'Schafkäse (Feta)', quantity: 50, unit: 'g', note: '' },
  { dish: 'Spinat-Schafkäse-Strudel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Spinat-Schafkäse-Strudel', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Gemüselaibchen
  { dish: 'Gemüselaibchen', ingredient: 'Karotten', quantity: 50, unit: 'g', note: '' },
  { dish: 'Gemüselaibchen', ingredient: 'Zucchini', quantity: 50, unit: 'g', note: '' },
  { dish: 'Gemüselaibchen', ingredient: 'Kartoffeln', quantity: 50, unit: 'g', note: '' },
  { dish: 'Gemüselaibchen', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Gemüselaibchen', ingredient: 'Semmelbrösel', quantity: 20, unit: 'g', note: '' },
  { dish: 'Gemüselaibchen', ingredient: 'Pflanzenöl', quantity: 15, unit: 'ml', note: '' },

  // Spinatlasagne
  { dish: 'Spinatlasagne', ingredient: 'Lasagneblätter', quantity: 60, unit: 'g', note: '' },
  { dish: 'Spinatlasagne', ingredient: 'TK-Spinat', quantity: 120, unit: 'g', note: '' },
  { dish: 'Spinatlasagne', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: 'Béchamel' },
  { dish: 'Spinatlasagne', ingredient: 'Mozzarella', quantity: 40, unit: 'g', note: '' },

  // Kaiserschmarrn
  { dish: 'Kaiserschmarrn', ingredient: 'Mehl (glatt)', quantity: 60, unit: 'g', note: '' },
  { dish: 'Kaiserschmarrn', ingredient: 'Milch', quantity: 80, unit: 'ml', note: '' },
  { dish: 'Kaiserschmarrn', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Kaiserschmarrn', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },
  { dish: 'Kaiserschmarrn', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Kaiserschmarrn', ingredient: 'Rosinen', quantity: 10, unit: 'g', note: '' },

  // Krautfleckerl
  { dish: 'Krautfleckerl', ingredient: 'Nudeln (Bandnudeln)', quantity: 100, unit: 'g', note: 'Fleckerl' },
  { dish: 'Krautfleckerl', ingredient: 'Weißkraut', quantity: 100, unit: 'g', note: '' },
  { dish: 'Krautfleckerl', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },
  { dish: 'Krautfleckerl', ingredient: 'Zucker', quantity: 5, unit: 'g', note: 'karamellisieren' },
  { dish: 'Krautfleckerl', ingredient: 'Schmalz', quantity: 15, unit: 'g', note: '' },

  // Kartoffelrösti
  { dish: 'Kartoffelrösti', ingredient: 'Kartoffeln', quantity: 200, unit: 'g', note: '' },
  { dish: 'Kartoffelrösti', ingredient: 'Butter', quantity: 20, unit: 'g', note: '' },
  { dish: 'Kartoffelrösti', ingredient: 'Muskatnuss', quantity: 1, unit: 'g', note: '' },

  // Bolognese vegetarisch
  { dish: 'Bolognese vegetarisch', ingredient: 'Nudeln (Spaghetti)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Bolognese vegetarisch', ingredient: 'Linsen', quantity: 50, unit: 'g', note: '' },
  { dish: 'Bolognese vegetarisch', ingredient: 'Tomaten (Dose/passiert)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Bolognese vegetarisch', ingredient: 'Karotten', quantity: 20, unit: 'g', note: '' },
  { dish: 'Bolognese vegetarisch', ingredient: 'Sellerie', quantity: 15, unit: 'g', note: '' },
  { dish: 'Bolognese vegetarisch', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },

  // Eiernockerl
  { dish: 'Eiernockerl', ingredient: 'Mehl (griffig)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Eiernockerl', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Eiernockerl', ingredient: 'Butter', quantity: 20, unit: 'g', note: '' },

  // =====================================================================
  // VEGETARISCHE GERICHTE Teil 2 (14 Stück)
  // =====================================================================
  // Topfenknödel
  { dish: 'Topfenknödel', ingredient: 'Topfen', quantity: 100, unit: 'g', note: '' },
  { dish: 'Topfenknödel', ingredient: 'Grieß', quantity: 30, unit: 'g', note: '' },
  { dish: 'Topfenknödel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Topfenknödel', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Topfenknödel', ingredient: 'Semmelbrösel', quantity: 20, unit: 'g', note: 'geröstet' },

  // Palatschinken
  { dish: 'Palatschinken', ingredient: 'Mehl (glatt)', quantity: 50, unit: 'g', note: '' },
  { dish: 'Palatschinken', ingredient: 'Milch', quantity: 80, unit: 'ml', note: '' },
  { dish: 'Palatschinken', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Palatschinken', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },
  { dish: 'Palatschinken', ingredient: 'Marmelade', quantity: 30, unit: 'g', note: 'Füllung' },

  // Gemüsestrudel
  { dish: 'Gemüsestrudel', ingredient: 'Strudelteig', quantity: 60, unit: 'g', note: '' },
  { dish: 'Gemüsestrudel', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüsestrudel', ingredient: 'Zucchini', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüsestrudel', ingredient: 'Paprika', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüsestrudel', ingredient: 'Schafkäse (Feta)', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüsestrudel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },

  // Erdäpfelgulasch
  { dish: 'Erdäpfelgulasch', ingredient: 'Kartoffeln', quantity: 200, unit: 'g', note: '' },
  { dish: 'Erdäpfelgulasch', ingredient: 'Zwiebeln', quantity: 50, unit: 'g', note: '' },
  { dish: 'Erdäpfelgulasch', ingredient: 'Paprikapulver (edelsüß)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Erdäpfelgulasch', ingredient: 'Tomatenmark', quantity: 10, unit: 'g', note: '' },
  { dish: 'Erdäpfelgulasch', ingredient: 'Kümmel', quantity: 1, unit: 'g', note: '' },
  { dish: 'Erdäpfelgulasch', ingredient: 'Majoran', quantity: 1, unit: 'g', note: '' },

  // Linsendalgemüse
  { dish: 'Linsendalgemüse', ingredient: 'Linsen', quantity: 80, unit: 'g', note: '' },
  { dish: 'Linsendalgemüse', ingredient: 'Zwiebeln', quantity: 25, unit: 'g', note: '' },
  { dish: 'Linsendalgemüse', ingredient: 'Karotten', quantity: 20, unit: 'g', note: '' },
  { dish: 'Linsendalgemüse', ingredient: 'Currypulver', quantity: 2, unit: 'g', note: '' },

  // Germknödel
  { dish: 'Germknödel', ingredient: 'Mehl (glatt)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Germknödel', ingredient: 'Germ (Hefe)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Germknödel', ingredient: 'Milch', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Germknödel', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },
  { dish: 'Germknödel', ingredient: 'Powidl (Pflaumenmus)', quantity: 30, unit: 'g', note: 'Füllung' },
  { dish: 'Germknödel', ingredient: 'Mohn (gemahlen)', quantity: 10, unit: 'g', note: '' },

  // Gemüse-Couscous
  { dish: 'Gemüse-Couscous', ingredient: 'Couscous', quantity: 80, unit: 'g', note: '' },
  { dish: 'Gemüse-Couscous', ingredient: 'Zucchini', quantity: 40, unit: 'g', note: '' },
  { dish: 'Gemüse-Couscous', ingredient: 'Paprika', quantity: 30, unit: 'g', note: '' },
  { dish: 'Gemüse-Couscous', ingredient: 'Karotten', quantity: 25, unit: 'g', note: '' },
  { dish: 'Gemüse-Couscous', ingredient: 'Olivenöl', quantity: 10, unit: 'ml', note: '' },

  // Ofengemüse-Teller mit Kräuterdip
  { dish: 'Ofengemüse-Teller mit Kräuterdip', ingredient: 'Zucchini', quantity: 50, unit: 'g', note: '' },
  { dish: 'Ofengemüse-Teller mit Kräuterdip', ingredient: 'Paprika', quantity: 40, unit: 'g', note: '' },
  { dish: 'Ofengemüse-Teller mit Kräuterdip', ingredient: 'Karotten', quantity: 40, unit: 'g', note: '' },
  { dish: 'Ofengemüse-Teller mit Kräuterdip', ingredient: 'Kartoffeln', quantity: 50, unit: 'g', note: '' },
  { dish: 'Ofengemüse-Teller mit Kräuterdip', ingredient: 'Olivenöl', quantity: 15, unit: 'ml', note: '' },
  { dish: 'Ofengemüse-Teller mit Kräuterdip', ingredient: 'Joghurt (natur)', quantity: 40, unit: 'g', note: 'Dip' },
  { dish: 'Ofengemüse-Teller mit Kräuterdip', ingredient: 'Schnittlauch', quantity: 3, unit: 'g', note: '' },

  // Gebackener Emmentaler
  { dish: 'Gebackener Emmentaler', ingredient: 'Emmentaler', quantity: 150, unit: 'g', note: '' },
  { dish: 'Gebackener Emmentaler', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Gebackener Emmentaler', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Gebackener Emmentaler', ingredient: 'Semmelbrösel', quantity: 25, unit: 'g', note: '' },
  { dish: 'Gebackener Emmentaler', ingredient: 'Pflanzenöl', quantity: 30, unit: 'ml', note: '' },

  // Schwammerlgulasch
  { dish: 'Schwammerlgulasch', ingredient: 'Champignons', quantity: 180, unit: 'g', note: '' },
  { dish: 'Schwammerlgulasch', ingredient: 'Zwiebeln', quantity: 40, unit: 'g', note: '' },
  { dish: 'Schwammerlgulasch', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Schwammerlgulasch', ingredient: 'Paprikapulver (edelsüß)', quantity: 3, unit: 'g', note: '' },

  // Mohnnudeln
  { dish: 'Mohnnudeln', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: 'Kartoffelteig' },
  { dish: 'Mohnnudeln', ingredient: 'Mehl (griffig)', quantity: 50, unit: 'g', note: '' },
  { dish: 'Mohnnudeln', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Mohnnudeln', ingredient: 'Mohn (gemahlen)', quantity: 20, unit: 'g', note: '' },
  { dish: 'Mohnnudeln', ingredient: 'Butter', quantity: 20, unit: 'g', note: '' },
  { dish: 'Mohnnudeln', ingredient: 'Zucker', quantity: 10, unit: 'g', note: '' },

  // Kürbisrisotto
  { dish: 'Kürbisrisotto', ingredient: 'Risotto-Reis', quantity: 80, unit: 'g', note: '' },
  { dish: 'Kürbisrisotto', ingredient: 'Kürbis', quantity: 100, unit: 'g', note: '' },
  { dish: 'Kürbisrisotto', ingredient: 'Parmesan', quantity: 15, unit: 'g', note: '' },
  { dish: 'Kürbisrisotto', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Kürbisrisotto', ingredient: 'Wein (weiß, zum Kochen)', quantity: 20, unit: 'ml', note: '' },

  // Tiroler Gröstl vegetarisch
  { dish: 'Tiroler Gröstl vegetarisch', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },
  { dish: 'Tiroler Gröstl vegetarisch', ingredient: 'Zwiebeln', quantity: 40, unit: 'g', note: '' },
  { dish: 'Tiroler Gröstl vegetarisch', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: 'Spiegelei' },
  { dish: 'Tiroler Gröstl vegetarisch', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },

  // Kartoffelpuffer
  { dish: 'Kartoffelpuffer', ingredient: 'Kartoffeln', quantity: 200, unit: 'g', note: '' },
  { dish: 'Kartoffelpuffer', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Kartoffelpuffer', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: '' },
  { dish: 'Kartoffelpuffer', ingredient: 'Pflanzenöl', quantity: 20, unit: 'ml', note: '' },

  // =====================================================================
  // BEILAGEN (38 Stück)
  // =====================================================================
  // Kartoffelgratin
  { dish: 'Kartoffelgratin', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },
  { dish: 'Kartoffelgratin', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Kartoffelgratin', ingredient: 'Gouda', quantity: 20, unit: 'g', note: '' },
  { dish: 'Kartoffelgratin', ingredient: 'Muskatnuss', quantity: 1, unit: 'g', note: '' },

  // Semmelknödel
  { dish: 'Semmelknödel', ingredient: 'Semmeln (altbacken)', quantity: 2, unit: 'stueck', note: '' },
  { dish: 'Semmelknödel', ingredient: 'Milch', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Semmelknödel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Semmelknödel', ingredient: 'Petersilie', quantity: 3, unit: 'g', note: '' },

  // Reis
  { dish: 'Reis', ingredient: 'Reis (Langkorn)', quantity: 80, unit: 'g', note: '' },

  // Kräuterreis
  { dish: 'Kräuterreis', ingredient: 'Reis (Langkorn)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Kräuterreis', ingredient: 'Petersilie', quantity: 3, unit: 'g', note: '' },
  { dish: 'Kräuterreis', ingredient: 'Schnittlauch', quantity: 2, unit: 'g', note: '' },

  // Gemüsereis
  { dish: 'Gemüsereis', ingredient: 'Reis (Langkorn)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Gemüsereis', ingredient: 'Karotten', quantity: 15, unit: 'g', note: '' },
  { dish: 'Gemüsereis', ingredient: 'Erbsen (frisch/TK)', quantity: 15, unit: 'g', note: '' },

  // Erbsenreis
  { dish: 'Erbsenreis', ingredient: 'Reis (Langkorn)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Erbsenreis', ingredient: 'TK-Erbsen', quantity: 30, unit: 'g', note: '' },

  // Butterspätzle
  { dish: 'Butterspätzle', ingredient: 'Mehl (griffig)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Butterspätzle', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Butterspätzle', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },

  // Buttergemüse
  { dish: 'Buttergemüse', ingredient: 'TK-Buttergemüse', quantity: 120, unit: 'g', note: '' },
  { dish: 'Buttergemüse', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Sauerkraut
  { dish: 'Sauerkraut', ingredient: 'Sauerkraut', quantity: 120, unit: 'g', note: '' },
  { dish: 'Sauerkraut', ingredient: 'Kümmel', quantity: 1, unit: 'g', note: '' },

  // Röstzwiebel
  { dish: 'Röstzwiebel', ingredient: 'Zwiebeln', quantity: 60, unit: 'g', note: '' },
  { dish: 'Röstzwiebel', ingredient: 'Mehl (glatt)', quantity: 10, unit: 'g', note: '' },
  { dish: 'Röstzwiebel', ingredient: 'Pflanzenöl', quantity: 15, unit: 'ml', note: '' },

  // Tomatensauce
  { dish: 'Tomatensauce', ingredient: 'Tomaten (Dose/passiert)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Tomatensauce', ingredient: 'Zwiebeln', quantity: 15, unit: 'g', note: '' },
  { dish: 'Tomatensauce', ingredient: 'Knoblauch', quantity: 3, unit: 'g', note: '' },
  { dish: 'Tomatensauce', ingredient: 'Basilikum', quantity: 2, unit: 'g', note: '' },
  { dish: 'Tomatensauce', ingredient: 'Olivenöl', quantity: 5, unit: 'ml', note: '' },

  // Pommes
  { dish: 'Pommes', ingredient: 'TK-Pommes', quantity: 150, unit: 'g', note: '' },

  // Petersilienerdäpfel
  { dish: 'Petersilienerdäpfel', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },
  { dish: 'Petersilienerdäpfel', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },
  { dish: 'Petersilienerdäpfel', ingredient: 'Petersilie', quantity: 3, unit: 'g', note: '' },

  // Couscous (Beilage)
  { dish: 'Couscous', ingredient: 'Couscous', quantity: 80, unit: 'g', note: '' },
  { dish: 'Couscous', ingredient: 'Olivenöl', quantity: 5, unit: 'ml', note: '' },

  // Serviettenknödel
  { dish: 'Serviettenknödel', ingredient: 'Semmeln (altbacken)', quantity: 2, unit: 'stueck', note: '' },
  { dish: 'Serviettenknödel', ingredient: 'Milch', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Serviettenknödel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },

  // Ofengemüse
  { dish: 'Ofengemüse', ingredient: 'Zucchini', quantity: 40, unit: 'g', note: '' },
  { dish: 'Ofengemüse', ingredient: 'Paprika', quantity: 30, unit: 'g', note: '' },
  { dish: 'Ofengemüse', ingredient: 'Karotten', quantity: 30, unit: 'g', note: '' },
  { dish: 'Ofengemüse', ingredient: 'Olivenöl', quantity: 10, unit: 'ml', note: '' },

  // Ofenkartoffeln
  { dish: 'Ofenkartoffeln', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },
  { dish: 'Ofenkartoffeln', ingredient: 'Olivenöl', quantity: 10, unit: 'ml', note: '' },

  // Erdäpfelpüree
  { dish: 'Erdäpfelpüree', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },
  { dish: 'Erdäpfelpüree', ingredient: 'Milch', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Erdäpfelpüree', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Erdäpfelpüree', ingredient: 'Muskatnuss', quantity: 1, unit: 'g', note: '' },

  // Bratensauce
  { dish: 'Bratensauce', ingredient: 'Rindssuppe (Fond)', quantity: 80, unit: 'ml', note: '' },
  { dish: 'Bratensauce', ingredient: 'Mehl (glatt)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Bratensauce', ingredient: 'Butter', quantity: 5, unit: 'g', note: '' },

  // Rahmsoße
  { dish: 'Rahmsoße', ingredient: 'Sahne (Schlagobers)', quantity: 60, unit: 'ml', note: '' },
  { dish: 'Rahmsoße', ingredient: 'Mehl (glatt)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Rahmsoße', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Preiselbeeren
  { dish: 'Preiselbeeren', ingredient: 'Preiselbeeren (Glas)', quantity: 40, unit: 'g', note: '' },

  // Apfelkompott
  { dish: 'Apfelkompott', ingredient: 'Äpfel', quantity: 100, unit: 'g', note: '' },
  { dish: 'Apfelkompott', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },
  { dish: 'Apfelkompott', ingredient: 'Zimt', quantity: 1, unit: 'g', note: '' },

  // Schnittlauchsauce
  { dish: 'Schnittlauchsauce', ingredient: 'Sauerrahm', quantity: 50, unit: 'g', note: '' },
  { dish: 'Schnittlauchsauce', ingredient: 'Schnittlauch', quantity: 5, unit: 'g', note: '' },

  // Bratkartoffeln
  { dish: 'Bratkartoffeln', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },
  { dish: 'Bratkartoffeln', ingredient: 'Pflanzenöl', quantity: 15, unit: 'ml', note: '' },
  { dish: 'Bratkartoffeln', ingredient: 'Zwiebeln', quantity: 20, unit: 'g', note: '' },

  // Kroketten
  { dish: 'Kroketten', ingredient: 'TK-Kroketten', quantity: 120, unit: 'g', note: '' },

  // Bandnudeln
  { dish: 'Bandnudeln', ingredient: 'Nudeln (Bandnudeln)', quantity: 100, unit: 'g', note: '' },
  { dish: 'Bandnudeln', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Salzerdäpfel
  { dish: 'Salzerdäpfel', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },

  // Polenta
  { dish: 'Polenta', ingredient: 'Polenta (Maisgrieß)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Polenta', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },
  { dish: 'Polenta', ingredient: 'Parmesan', quantity: 10, unit: 'g', note: '' },

  // Erdäpfelsalat
  { dish: 'Erdäpfelsalat', ingredient: 'Kartoffeln', quantity: 150, unit: 'g', note: '' },
  { dish: 'Erdäpfelsalat', ingredient: 'Zwiebeln', quantity: 15, unit: 'g', note: '' },
  { dish: 'Erdäpfelsalat', ingredient: 'Essig (Weinessig)', quantity: 10, unit: 'ml', note: '' },
  { dish: 'Erdäpfelsalat', ingredient: 'Pflanzenöl', quantity: 10, unit: 'ml', note: '' },
  { dish: 'Erdäpfelsalat', ingredient: 'Senf', quantity: 3, unit: 'g', note: '' },

  // Blattsalat
  { dish: 'Blattsalat', ingredient: 'Blattsalat', quantity: 60, unit: 'g', note: '' },
  { dish: 'Blattsalat', ingredient: 'Essig (Weinessig)', quantity: 5, unit: 'ml', note: '' },
  { dish: 'Blattsalat', ingredient: 'Pflanzenöl', quantity: 5, unit: 'ml', note: '' },

  // Gurkensalat
  { dish: 'Gurkensalat', ingredient: 'Gurke', quantity: 100, unit: 'g', note: '' },
  { dish: 'Gurkensalat', ingredient: 'Essig (Weinessig)', quantity: 5, unit: 'ml', note: '' },
  { dish: 'Gurkensalat', ingredient: 'Pflanzenöl', quantity: 5, unit: 'ml', note: '' },

  // Krautsalat
  { dish: 'Krautsalat', ingredient: 'Weißkraut', quantity: 100, unit: 'g', note: '' },
  { dish: 'Krautsalat', ingredient: 'Essig (Weinessig)', quantity: 5, unit: 'ml', note: '' },
  { dish: 'Krautsalat', ingredient: 'Pflanzenöl', quantity: 5, unit: 'ml', note: '' },
  { dish: 'Krautsalat', ingredient: 'Kümmel', quantity: 1, unit: 'g', note: '' },

  // Rotkraut
  { dish: 'Rotkraut', ingredient: 'Rotkraut', quantity: 120, unit: 'g', note: '' },
  { dish: 'Rotkraut', ingredient: 'Zucker', quantity: 5, unit: 'g', note: '' },
  { dish: 'Rotkraut', ingredient: 'Essig (Weinessig)', quantity: 5, unit: 'ml', note: '' },

  // Fisolen
  { dish: 'Fisolen', ingredient: 'Fisolen (grüne Bohnen)', quantity: 120, unit: 'g', note: '' },
  { dish: 'Fisolen', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Djuvec-Reis
  { dish: 'Djuvec-Reis', ingredient: 'Reis (Langkorn)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Djuvec-Reis', ingredient: 'Paprika', quantity: 20, unit: 'g', note: '' },
  { dish: 'Djuvec-Reis', ingredient: 'Tomaten (Dose/passiert)', quantity: 30, unit: 'g', note: '' },
  { dish: 'Djuvec-Reis', ingredient: 'Zwiebeln', quantity: 15, unit: 'g', note: '' },

  // Rahmfisolen
  { dish: 'Rahmfisolen', ingredient: 'Fisolen (grüne Bohnen)', quantity: 120, unit: 'g', note: '' },
  { dish: 'Rahmfisolen', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Rahmfisolen', ingredient: 'Mehl (glatt)', quantity: 5, unit: 'g', note: '' },

  // Apfelkren
  { dish: 'Apfelkren', ingredient: 'Äpfel', quantity: 50, unit: 'g', note: '' },
  { dish: 'Apfelkren', ingredient: 'Kren (Meerrettich)', quantity: 20, unit: 'g', note: '' },
  { dish: 'Apfelkren', ingredient: 'Sahne (Schlagobers)', quantity: 15, unit: 'ml', note: '' },

  // Semmelkren
  { dish: 'Semmelkren', ingredient: 'Semmeln (altbacken)', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Semmelkren', ingredient: 'Kren (Meerrettich)', quantity: 20, unit: 'g', note: '' },
  { dish: 'Semmelkren', ingredient: 'Rindssuppe (Fond)', quantity: 40, unit: 'ml', note: '' },

  // =====================================================================
  // DESSERTS (23 Stück)
  // =====================================================================
  // Dessertvariation
  { dish: 'Dessertvariation', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Dessertvariation', ingredient: 'Obst (saisonal/gemischt)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Dessertvariation', ingredient: 'Schokolade (Kochschokolade)', quantity: 15, unit: 'g', note: '' },

  // Obstsalat
  { dish: 'Obstsalat', ingredient: 'Obst (saisonal/gemischt)', quantity: 150, unit: 'g', note: '' },
  { dish: 'Obstsalat', ingredient: 'Zucker', quantity: 5, unit: 'g', note: '' },
  { dish: 'Obstsalat', ingredient: 'Zitronen', quantity: 5, unit: 'g', note: 'Saft' },

  // Joghurt mit Früchten
  { dish: 'Joghurt mit Früchten', ingredient: 'Joghurt (natur)', quantity: 150, unit: 'g', note: '' },
  { dish: 'Joghurt mit Früchten', ingredient: 'Obst (saisonal/gemischt)', quantity: 50, unit: 'g', note: '' },
  { dish: 'Joghurt mit Früchten', ingredient: 'Zucker', quantity: 5, unit: 'g', note: '' },

  // Pudding
  { dish: 'Pudding', ingredient: 'Milch', quantity: 200, unit: 'ml', note: '' },
  { dish: 'Pudding', ingredient: 'Zucker', quantity: 20, unit: 'g', note: '' },
  { dish: 'Pudding', ingredient: 'Vanillezucker', quantity: 5, unit: 'g', note: '' },
  { dish: 'Pudding', ingredient: 'Mehl (glatt)', quantity: 15, unit: 'g', note: 'Stärke' },

  // Tiramisu
  { dish: 'Tiramisu', ingredient: 'Mascarpone', quantity: 60, unit: 'g', note: '' },
  { dish: 'Tiramisu', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Tiramisu', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },
  { dish: 'Tiramisu', ingredient: 'Biskotten (Löffelbiskuit)', quantity: 20, unit: 'g', note: '' },
  { dish: 'Tiramisu', ingredient: 'Espresso (Kaffee)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Tiramisu', ingredient: 'Kakao', quantity: 3, unit: 'g', note: '' },

  // Apfelstrudel
  { dish: 'Apfelstrudel', ingredient: 'Strudelteig', quantity: 40, unit: 'g', note: '' },
  { dish: 'Apfelstrudel', ingredient: 'Äpfel', quantity: 120, unit: 'g', note: '' },
  { dish: 'Apfelstrudel', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },
  { dish: 'Apfelstrudel', ingredient: 'Zimt', quantity: 1, unit: 'g', note: '' },
  { dish: 'Apfelstrudel', ingredient: 'Rosinen', quantity: 10, unit: 'g', note: '' },
  { dish: 'Apfelstrudel', ingredient: 'Semmelbrösel', quantity: 10, unit: 'g', note: '' },
  { dish: 'Apfelstrudel', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Schokomousse
  { dish: 'Schokomousse', ingredient: 'Schokolade (Kochschokolade)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Schokomousse', ingredient: 'Sahne (Schlagobers)', quantity: 60, unit: 'ml', note: '' },
  { dish: 'Schokomousse', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Schokomousse', ingredient: 'Zucker', quantity: 10, unit: 'g', note: '' },

  // Panna Cotta
  { dish: 'Panna Cotta', ingredient: 'Sahne (Schlagobers)', quantity: 100, unit: 'ml', note: '' },
  { dish: 'Panna Cotta', ingredient: 'Milch', quantity: 50, unit: 'ml', note: '' },
  { dish: 'Panna Cotta', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },
  { dish: 'Panna Cotta', ingredient: 'Gelatine', quantity: 3, unit: 'g', note: '' },

  // Grießflammeri
  { dish: 'Grießflammeri', ingredient: 'Milch', quantity: 200, unit: 'ml', note: '' },
  { dish: 'Grießflammeri', ingredient: 'Grieß', quantity: 30, unit: 'g', note: '' },
  { dish: 'Grießflammeri', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },
  { dish: 'Grießflammeri', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },

  // Topfencreme mit Beeren
  { dish: 'Topfencreme mit Beeren', ingredient: 'Topfen', quantity: 80, unit: 'g', note: '' },
  { dish: 'Topfencreme mit Beeren', ingredient: 'Sahne (Schlagobers)', quantity: 30, unit: 'ml', note: '' },
  { dish: 'Topfencreme mit Beeren', ingredient: 'Beeren (gemischt)', quantity: 50, unit: 'g', note: '' },
  { dish: 'Topfencreme mit Beeren', ingredient: 'Zucker', quantity: 10, unit: 'g', note: '' },

  // Vanilleeis mit Früchten
  { dish: 'Vanilleeis mit Früchten', ingredient: 'Vanilleeis', quantity: 100, unit: 'ml', note: '' },
  { dish: 'Vanilleeis mit Früchten', ingredient: 'Obst (saisonal/gemischt)', quantity: 60, unit: 'g', note: '' },

  // Mohr im Hemd
  { dish: 'Mohr im Hemd', ingredient: 'Schokolade (Kochschokolade)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Mohr im Hemd', ingredient: 'Butter', quantity: 20, unit: 'g', note: '' },
  { dish: 'Mohr im Hemd', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Mohr im Hemd', ingredient: 'Zucker', quantity: 20, unit: 'g', note: '' },
  { dish: 'Mohr im Hemd', ingredient: 'Semmelbrösel', quantity: 15, unit: 'g', note: '' },
  { dish: 'Mohr im Hemd', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: 'Schlag' },

  // Buchteln mit Vanillesauce
  { dish: 'Buchteln mit Vanillesauce', ingredient: 'Mehl (glatt)', quantity: 80, unit: 'g', note: '' },
  { dish: 'Buchteln mit Vanillesauce', ingredient: 'Germ (Hefe)', quantity: 5, unit: 'g', note: '' },
  { dish: 'Buchteln mit Vanillesauce', ingredient: 'Milch', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Buchteln mit Vanillesauce', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Buchteln mit Vanillesauce', ingredient: 'Marmelade', quantity: 20, unit: 'g', note: 'Füllung' },
  { dish: 'Buchteln mit Vanillesauce', ingredient: 'Vanillezucker', quantity: 5, unit: 'g', note: 'Vanillesauce' },

  // Reisauflauf mit Kirschen
  { dish: 'Reisauflauf mit Kirschen', ingredient: 'Reis (Langkorn)', quantity: 60, unit: 'g', note: '' },
  { dish: 'Reisauflauf mit Kirschen', ingredient: 'Milch', quantity: 100, unit: 'ml', note: '' },
  { dish: 'Reisauflauf mit Kirschen', ingredient: 'Kirschen (Glas)', quantity: 60, unit: 'g', note: '' },
  { dish: 'Reisauflauf mit Kirschen', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Reisauflauf mit Kirschen', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },

  // Schokokuchen
  { dish: 'Schokokuchen', ingredient: 'Schokolade (Kochschokolade)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Schokokuchen', ingredient: 'Butter', quantity: 30, unit: 'g', note: '' },
  { dish: 'Schokokuchen', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Schokokuchen', ingredient: 'Zucker', quantity: 25, unit: 'g', note: '' },
  { dish: 'Schokokuchen', ingredient: 'Mehl (glatt)', quantity: 30, unit: 'g', note: '' },

  // Marillenknödel
  { dish: 'Marillenknödel', ingredient: 'Kartoffeln', quantity: 100, unit: 'g', note: 'Kartoffelteig' },
  { dish: 'Marillenknödel', ingredient: 'Mehl (griffig)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Marillenknödel', ingredient: 'Marillen', quantity: 80, unit: 'g', note: '' },
  { dish: 'Marillenknödel', ingredient: 'Semmelbrösel', quantity: 20, unit: 'g', note: 'geröstet' },
  { dish: 'Marillenknödel', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },
  { dish: 'Marillenknödel', ingredient: 'Zucker', quantity: 10, unit: 'g', note: '' },

  // Sachertorte
  { dish: 'Sachertorte', ingredient: 'Schokolade (Kochschokolade)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Sachertorte', ingredient: 'Butter', quantity: 25, unit: 'g', note: '' },
  { dish: 'Sachertorte', ingredient: 'Eier', quantity: 1, unit: 'stueck', note: '' },
  { dish: 'Sachertorte', ingredient: 'Zucker', quantity: 25, unit: 'g', note: '' },
  { dish: 'Sachertorte', ingredient: 'Mehl (glatt)', quantity: 25, unit: 'g', note: '' },
  { dish: 'Sachertorte', ingredient: 'Marmelade', quantity: 15, unit: 'g', note: 'Marillenmarmelade' },

  // Linzer Torte
  { dish: 'Linzer Torte', ingredient: 'Mehl (glatt)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Linzer Torte', ingredient: 'Butter', quantity: 30, unit: 'g', note: '' },
  { dish: 'Linzer Torte', ingredient: 'Zucker', quantity: 20, unit: 'g', note: '' },
  { dish: 'Linzer Torte', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Linzer Torte', ingredient: 'Marmelade', quantity: 30, unit: 'g', note: 'Ribiselmarmelade' },
  { dish: 'Linzer Torte', ingredient: 'Zimt', quantity: 1, unit: 'g', note: '' },

  // Topfenstrudel
  { dish: 'Topfenstrudel', ingredient: 'Strudelteig', quantity: 40, unit: 'g', note: '' },
  { dish: 'Topfenstrudel', ingredient: 'Topfen', quantity: 100, unit: 'g', note: '' },
  { dish: 'Topfenstrudel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Topfenstrudel', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },
  { dish: 'Topfenstrudel', ingredient: 'Rosinen', quantity: 10, unit: 'g', note: '' },
  { dish: 'Topfenstrudel', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Milchrahmstrudel
  { dish: 'Milchrahmstrudel', ingredient: 'Strudelteig', quantity: 40, unit: 'g', note: '' },
  { dish: 'Milchrahmstrudel', ingredient: 'Milch', quantity: 100, unit: 'ml', note: '' },
  { dish: 'Milchrahmstrudel', ingredient: 'Sahne (Schlagobers)', quantity: 40, unit: 'ml', note: '' },
  { dish: 'Milchrahmstrudel', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Milchrahmstrudel', ingredient: 'Zucker', quantity: 15, unit: 'g', note: '' },
  { dish: 'Milchrahmstrudel', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },

  // Powidltascherl
  { dish: 'Powidltascherl', ingredient: 'Kartoffeln', quantity: 100, unit: 'g', note: 'Kartoffelteig' },
  { dish: 'Powidltascherl', ingredient: 'Mehl (griffig)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Powidltascherl', ingredient: 'Eier', quantity: 0.5, unit: 'stueck', note: '' },
  { dish: 'Powidltascherl', ingredient: 'Powidl (Pflaumenmus)', quantity: 40, unit: 'g', note: '' },
  { dish: 'Powidltascherl', ingredient: 'Semmelbrösel', quantity: 15, unit: 'g', note: 'geröstet' },
  { dish: 'Powidltascherl', ingredient: 'Butter', quantity: 15, unit: 'g', note: '' },

  // Zwetschkenröster
  { dish: 'Zwetschkenröster', ingredient: 'Zwetschken', quantity: 120, unit: 'g', note: '' },
  { dish: 'Zwetschkenröster', ingredient: 'Zucker', quantity: 20, unit: 'g', note: '' },
  { dish: 'Zwetschkenröster', ingredient: 'Zimt', quantity: 1, unit: 'g', note: '' },

  // Salzburger Nockerl
  { dish: 'Salzburger Nockerl', ingredient: 'Eier', quantity: 2, unit: 'stueck', note: '' },
  { dish: 'Salzburger Nockerl', ingredient: 'Zucker', quantity: 20, unit: 'g', note: '' },
  { dish: 'Salzburger Nockerl', ingredient: 'Mehl (glatt)', quantity: 10, unit: 'g', note: '' },
  { dish: 'Salzburger Nockerl', ingredient: 'Butter', quantity: 10, unit: 'g', note: '' },
  { dish: 'Salzburger Nockerl', ingredient: 'Vanillezucker', quantity: 5, unit: 'g', note: '' },
  { dish: 'Salzburger Nockerl', ingredient: 'Staubzucker', quantity: 5, unit: 'g', note: '' },
];

// =====================================================================
// SEED FUNKTION
// =====================================================================

export function seedIngredients() {
  const db = getDb();

  const existingCount = (db.prepare('SELECT COUNT(*) as cnt FROM ingredients').get() as { cnt: number }).cnt;
  if (existingCount > 0) return;

  const insertIngredient = db.prepare(`
    INSERT OR IGNORE INTO ingredients (name, category, unit, price_per_unit, price_unit, supplier)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertRecipeItem = db.prepare(`
    INSERT OR IGNORE INTO recipe_items (dish_id, ingredient_id, quantity, unit, preparation_note, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const ing of INGREDIENTS) {
      insertIngredient.run(ing.name, ing.category, ing.unit, ing.price_per_unit, ing.price_unit, ing.supplier);
    }

    for (let i = 0; i < RECIPE_ITEMS.length; i++) {
      const r = RECIPE_ITEMS[i];
      const dish = db.prepare('SELECT id FROM dishes WHERE name = ?').get(r.dish) as { id: number } | undefined;
      const ingredient = db.prepare('SELECT id FROM ingredients WHERE name = ?').get(r.ingredient) as { id: number } | undefined;
      if (dish && ingredient) {
        insertRecipeItem.run(dish.id, ingredient.id, r.quantity, r.unit, r.note, i);
      }
    }
  })();
}
