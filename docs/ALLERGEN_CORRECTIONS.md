# Allergen-Korrekturen (EU 1169/2011)

## WICHTIG: Diese Änderungen SOFORT in `src/lib/seed.ts` einpflegen!

**Fehlerquote: ~15% der Gerichte haben falsche Allergene**

---

## SUPPEN

```typescript
// KORREKTUREN:
{ name: 'Nudelsuppe', category: 'suppe', allergens: 'ACGL' },  // WAR: 'ACG' - FEHLT G
{ name: 'Grießnockerlsuppe', category: 'suppe', allergens: 'ACEG' },  // WAR: 'ACG' - FEHLT E
```

---

## FLEISCHGERICHTE

```typescript
// KORREKTUREN:
{ name: 'Rindsgeschnetzeltes', category: 'fleisch', allergens: 'AGL' },  // WAR: 'ACG' - kein C (nicht paniert), braucht L (Sellerie)
{ name: 'Hühnerfilet', category: 'fleisch', allergens: 'A' },  // WAR: 'AG' - G optional je nach Marinade
{ name: 'Hühnerstreifen', category: 'fleisch', allergens: 'ACG' },  // WAR: 'AG' - FEHLT C (paniert)
{ name: 'Hühnergeschnetzeltes', category: 'fleisch', allergens: 'AGL' },  // WAR: 'AG' - FEHLT L (Sellerie in Rahmsauce)
{ name: 'Puten-Rahmgeschnetzeltes', category: 'fleisch', allergens: 'ACGL' },  // WAR: 'ACG' - FEHLT L (Sellerie)
{ name: 'Rindsgulasch', category: 'fleisch', allergens: 'AL' },  // WAR: 'A' - FEHLT L (Sellerie im Gulasch)
{ name: 'Gemüse-Hühnercurry', category: 'fleisch', allergens: 'AGFL' },  // WAR: 'AGF' - FEHLT L (Currypaste)
{ name: 'Korma-Hühnerkeule', category: 'fleisch', allergens: 'AGFHL' },  // WAR: 'AGH' - FEHLT F+L (Soja + Sellerie in Currypaste)
{ name: 'Spaghetti Bolognaise', category: 'fleisch', allergens: 'ACGL' },  // WAR: 'ACG' - FEHLT L (Sellerie in Bolognese!)
```

---

## VEGETARISCH

```typescript
// KORREKTUREN:
{ name: 'Kartoffelrösti', category: 'vegetarisch', allergens: 'ACG' },  // WAR: 'AG' - FEHLT C (Ei bindet Rösti)
{ name: 'Bolognese vegetarisch', category: 'vegetarisch', allergens: 'AFL' },  // WAR: 'AF' - FEHLT L (Sellerie)
```

---

## BEILAGEN

```typescript
// KORREKTUREN:
{ name: 'Bratensauce', category: 'beilage', allergens: 'AL' },  // WAR: 'A' - FEHLT L (Sellerie im Bratensaft)
```

---

## VOLLSTÄNDIGE KORRIGIERTE DISH-LISTE

Hier ist die **komplette korrigierte DISHES-Array** zum direkten Ersetzen in `src/lib/seed.ts`:

```typescript
const DISHES: DishSeed[] = [
  // === SUPPEN ===
  { name: 'Kürbiscremesuppe', category: 'suppe', allergens: 'AGL' },
  { name: 'Rindsuppe mit Frittaten', category: 'suppe', allergens: 'ACGL' },
  { name: 'Kartoffelcremesuppe', category: 'suppe', allergens: 'AGL' },
  { name: 'Gemüsesuppe', category: 'suppe', allergens: 'AL' },
  { name: 'Tomatencremesuppe', category: 'suppe', allergens: 'AGL' },
  { name: 'Nudelsuppe', category: 'suppe', allergens: 'ACGL' },  // ✅ KORRIGIERT
  { name: 'Frittatensuppe', category: 'suppe', allergens: 'ACG' },
  { name: 'Grießnockerlsuppe', category: 'suppe', allergens: 'ACEG' },  // ✅ KORRIGIERT
  { name: 'Leberknödelsuppe', category: 'suppe', allergens: 'ACG' },
  { name: 'Backerbsensuppe', category: 'suppe', allergens: 'ACG' },
  { name: 'Minestrone', category: 'suppe', allergens: 'AL' },
  { name: 'Spargelcremesuppe', category: 'suppe', allergens: 'AGL' },
  { name: 'Karottencremesuppe', category: 'suppe', allergens: 'GL' },

  // === FLEISCHGERICHTE ===
  { name: 'Naturschnitzel vom Schwein', category: 'fleisch', allergens: 'ACG' },
  { name: 'Schweinsbraten', category: 'fleisch', allergens: 'A' },
  { name: 'Rindsgeschnetzeltes', category: 'fleisch', allergens: 'AGL' },  // ✅ KORRIGIERT
  { name: 'Hühnerfilet', category: 'fleisch', allergens: 'A' },  // ✅ KORRIGIERT
  { name: 'Hühnerstreifen', category: 'fleisch', allergens: 'ACG' },  // ✅ KORRIGIERT
  { name: 'Hühnergeschnetzeltes', category: 'fleisch', allergens: 'AGL' },  // ✅ KORRIGIERT
  { name: 'Putenschnitzel', category: 'fleisch', allergens: 'ACG' },
  { name: 'Puten-Rahmgeschnetzeltes', category: 'fleisch', allergens: 'ACGL' },  // ✅ KORRIGIERT
  { name: 'Rinderbraten', category: 'fleisch', allergens: 'A' },
  { name: 'Rindsgulasch', category: 'fleisch', allergens: 'AL' },  // ✅ KORRIGIERT
  { name: 'Schweinefilet', category: 'fleisch', allergens: 'A' },
  { name: 'Gemüse-Hühnercurry', category: 'fleisch', allergens: 'AGFL' },  // ✅ KORRIGIERT
  { name: 'Pariser Schnitzel', category: 'fleisch', allergens: 'ACG' },
  { name: 'Korma-Hühnerkeule', category: 'fleisch', allergens: 'AGFHL' },  // ✅ KORRIGIERT
  { name: 'Schnitzel vom Schwein', category: 'fleisch', allergens: 'ACG' },
  { name: 'Spaghetti Bolognaise', category: 'fleisch', allergens: 'ACGL' },  // ✅ KORRIGIERT
  { name: 'Wiener Schnitzel', category: 'fleisch', allergens: 'ACG' },
  { name: 'Tafelspitz', category: 'fleisch', allergens: 'L' },
  { name: 'Cevapcici', category: 'fleisch', allergens: 'A' },

  // === FISCHGERICHTE ===
  { name: 'Seehechtfilet', category: 'fisch', allergens: 'D' },
  { name: 'Lachsfilet', category: 'fisch', allergens: 'D' },
  { name: 'Seelachsfilet gebacken', category: 'fisch', allergens: 'ACD' },
  { name: 'Fischstäbchen', category: 'fisch', allergens: 'ACD' },
  { name: 'Seehecht gebraten', category: 'fisch', allergens: 'AD' },

  // === VEGETARISCHE GERICHTE ===
  { name: 'Käsespätzle', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Spinat-Tortellini', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Gemüse-Lasagne', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Pasta all\'arrabbiata', category: 'vegetarisch', allergens: 'A' },
  { name: 'Kasnudeln', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Fruchtknödel', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Spinat-Schafkäse-Strudel', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Gemüselaibchen', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Spinatlasagne', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Kaiserschmarrn', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Krautfleckerl', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Kartoffelrösti', category: 'vegetarisch', allergens: 'ACG' },  // ✅ KORRIGIERT
  { name: 'Bolognese vegetarisch', category: 'vegetarisch', allergens: 'AFL' },  // ✅ KORRIGIERT
  { name: 'Eiernockerl', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Topfenknödel', category: 'vegetarisch', allergens: 'ACG' },
  { name: 'Palatschinken', category: 'vegetarisch', allergens: 'ACG' },

  // === BEILAGEN ===
  { name: 'Kartoffelgratin', category: 'beilage', allergens: 'AG' },
  { name: 'Semmelknödel', category: 'beilage', allergens: 'ACG' },
  { name: 'Reis', category: 'beilage', allergens: '' },
  { name: 'Kräuterreis', category: 'beilage', allergens: '' },
  { name: 'Gemüsereis', category: 'beilage', allergens: '' },
  { name: 'Erbsenreis', category: 'beilage', allergens: '' },
  { name: 'Butterspätzle', category: 'beilage', allergens: 'ACG' },
  { name: 'Buttergemüse', category: 'beilage', allergens: 'G' },
  { name: 'Sauerkraut', category: 'beilage', allergens: '' },
  { name: 'Röstzwiebel', category: 'beilage', allergens: 'A' },
  { name: 'Tomatensauce', category: 'beilage', allergens: 'L' },
  { name: 'Pommes', category: 'beilage', allergens: '' },
  { name: 'Petersilienerdäpfel', category: 'beilage', allergens: '' },
  { name: 'Couscous', category: 'beilage', allergens: 'A' },
  { name: 'Serviettenknödel', category: 'beilage', allergens: 'ACG' },
  { name: 'Ofengemüse', category: 'beilage', allergens: '' },
  { name: 'Ofenkartoffeln', category: 'beilage', allergens: '' },
  { name: 'Erdäpfelpüree', category: 'beilage', allergens: 'G' },
  { name: 'Bratensauce', category: 'beilage', allergens: 'AL' },  // ✅ KORRIGIERT
  { name: 'Rahmsoße', category: 'beilage', allergens: 'AG' },
  { name: 'Preiselbeeren', category: 'beilage', allergens: '' },
  { name: 'Apfelkompott', category: 'beilage', allergens: '' },
  { name: 'Schnittlauchsauce', category: 'beilage', allergens: 'G' },

  // === DESSERTS ===
  { name: 'Dessertvariation', category: 'dessert', allergens: 'ACG' },
  { name: 'Obstsalat', category: 'dessert', allergens: '' },
  { name: 'Joghurt mit Früchten', category: 'dessert', allergens: 'G' },
  { name: 'Pudding', category: 'dessert', allergens: 'G' },
  { name: 'Tiramisu', category: 'dessert', allergens: 'ACG' },
  { name: 'Apfelstrudel', category: 'dessert', allergens: 'ACG' },
  { name: 'Schokomousse', category: 'dessert', allergens: 'CG' },
  { name: 'Panna Cotta', category: 'dessert', allergens: 'G' },
];
```

---

## BEGRÜNDUNGEN (Warum diese Allergene?)

### Sellerie (L) in Geschnetzeltem, Gulasch, Bolognese, Bratensauce, Currys

**Grund:** Sellerie ist Standard-Suppengemüse (Mirepoix/Suppengrün) in:
- Rahmsaucen (wird mit Fond gemacht → Sellerie)
- Bolognese (Soffritto = Sellerie + Karotte + Zwiebel)
- Gulasch (Suppengemüse-Basis)
- Bratensaucen (Fond aus Knochen + Suppengrün)
- Currypasten (vor allem indische/thailändische)

### Eier (C) in Grießnockerl, Kartoffelrösti, Hühnerstreifen

**Grund:**
- **Grießnockerl:** Klassisches Rezept = Grieß + Ei + Butter (Ei bindet)
- **Kartoffelrösti:** Eier binden die geriebenen Kartoffeln
- **Hühnerstreifen:** Meist paniert (Mehl → Ei → Panier)

### Soja (F) in Curry-Gerichten

**Grund:** Industrielle Currypasten enthalten oft Soja (Geschmacksverstärker, Bindemittel)

### Milch/Laktose (G) in Nudelsuppe

**Grund:** Nudelteig wird traditionell mit Butter gemacht, Suppe oft mit Sahne verfeinert

### KEIN Gluten (C) in Rindsgeschnetzeltes

**Grund:** Geschnetzeltes wird NICHT paniert, nur in Mehl gewendet (A ausreichend)

---

## VERWENDUNG

1. **Datenbank neu seeden:**
   ```bash
   # In menuplan-app/
   rm data/menuplan.db
   npm run dev
   # Öffne http://localhost:3000/api/init
   ```

2. **Oder via Gerichte-Page manuell editieren:**
   - http://localhost:3000/gerichte
   - Jedes Gericht einzeln bearbeiten

3. **Oder SQL-Update:**
   ```sql
   UPDATE dishes SET allergens = 'ACGL' WHERE name = 'Nudelsuppe';
   UPDATE dishes SET allergens = 'ACEG' WHERE name = 'Grießnockerlsuppe';
   -- etc.
   ```

---

**WICHTIG:** Nach Korrektur die Rotation-Pläne neu generieren!

```bash
# Lösche alle weekly_plans, damit sie neu generiert werden
DELETE FROM weekly_plans;
```

---

**Erstellt:** 2026-01-31
**Quelle:** Kritische Code-Review
