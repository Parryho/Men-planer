// Client-safe constants (no server dependencies)
export const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
export const DAY_NAMES_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export const INGREDIENT_CATEGORIES: Record<string, string> = {
  fleisch: 'Fleisch & Wurst',
  fisch: 'Fisch & Meeresfr\u00fcchte',
  gemuese: 'Gem\u00fcse & Salat',
  milchprodukte: 'Milchprodukte',
  trockenwaren: 'Trockenwaren & Getreide',
  gewuerze: 'Gew\u00fcrze & Kr\u00e4uter',
  eier_fette: 'Eier & Fette',
  obst: 'Obst & Fr\u00fcchte',
  tiefkuehl: 'Tiefk\u00fchlware',
  sonstiges: 'Sonstiges',
};

export const UNITS: Record<string, string> = {
  g: 'Gramm',
  kg: 'Kilogramm',
  ml: 'Milliliter',
  l: 'Liter',
  stueck: 'St\u00fcck',
};
