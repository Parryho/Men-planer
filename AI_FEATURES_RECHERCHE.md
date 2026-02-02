# KI-Features Recherche: Menuplan-Generator Web-App

> **Recherche-Datum:** 01.02.2026
> **Kontext:** Menuplan-Generator fuer Kuechenchef mit 2 Hotels (JUFA City + JUFA SUED) + 1 Catering (Arbeiterkammer)
> **Bestehende Features:** 6-Wochen-Rotation, 128 Gerichte mit Allergenen, HACCP-Temperaturen, Felix OCR fuer Gaestezahlen, Excel-Export

---

## Priorisierte Feature-Liste

### Prioritaet 1 -- Hoher Mehrwert, niedriger bis mittlerer Aufwand

---

#### 1. KI-gestuetzte Menuplanung & automatische Vorschlaege

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | KI analysiert den bestehenden 6-Wochen-Rotationsplan und schlaegt automatisch Gerichte vor, basierend auf Saison, bisheriger Beliebtheit, Naehrwertbalance und Abwechslung. Das System erkennt Wiederholungsmuster und empfiehlt Alternativen aus dem 128-Gerichte-Pool oder schlaegt neue saisonale Gerichte vor. Laut Branchenberichten erzielen Betriebe damit im Schnitt +2 EUR Deckungsbeitrag pro Hauptgericht. |
| **Technologie** | OpenAI GPT-4o API (Chat Completions) fuer Vorschlagslogik, eigene Datenbank mit Gerichte-Scores. Alternativ: Claude API von Anthropic. Prompt Engineering mit Kontext (Saison, letzte Wochen, Allergene, Standort). |
| **Aufwand** | **Mittel** -- API-Anbindung + Prompt-Design + UI fuer Vorschlaege. Ca. 2-3 Wochen Entwicklung. |
| **Mehrwert fuer Kuechenchef** | Spart 1-2 Stunden pro Woche bei der Menuplanung. Verhindert einseitige Rotation. Beruecksichtigt automatisch saisonale Verfuegbarkeit und Naehrwertbalance ueber alle 3 Standorte. |

---

#### 2. Automatische Naehrwertberechnung pro Gericht

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | Jedes der 128 Gerichte erhaelt automatisch eine vollstaendige Naehrwertanalyse (Kalorien, Fett, Kohlenhydrate, Protein, 28 Mikro-/Makronaehrstoffe). Die Berechnung erfolgt ueber NLP -- man gibt die Zutatenliste als Text ein, die API extrahiert Mengen und berechnet Naehrwerte in unter 1 Sekunde. Besonders wertvoll fuer Catering-Ausschreibungen und Gaesteinformation. |
| **Technologie** | **Edamam Nutrition Analysis API** (kostenlos bis 999 USD/Monat, NLP-faehig, 900.000+ Lebensmittel, 90+ Allergen-/Diaet-Labels, deutschsprachige Rezepte unterstuetzt). Alternative: Nutritionix API (staerker auf US-Markt, ab 1.850 USD/Monat Enterprise). |
| **Aufwand** | **Niedrig** -- REST-API Anbindung, Zutatenliste je Gericht als Input. Ca. 1 Woche Entwicklung. |
| **Mehrwert fuer Kuechenchef** | Automatische Naehrwerttabellen fuer Speisekarten, Erfuellung von Kennzeichnungspflichten, bessere Planung fuer diaetetische Anforderungen (Arbeiterkammer-Catering). |

---

#### 3. Digitale Speisekarte mit QR-Code fuer Gaeste

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | Automatische Generierung von QR-Codes, die Gaeste mit dem Smartphone scannen, um den aktuellen Wochenmenuplan mit Allergen-Kennzeichnung, Naehrwerten und optionalen Gericht-Fotos zu sehen. Aenderungen im Backend werden sofort live aktualisiert -- kein Neudruck noetig. Mehrsprachig fuer internationale Hotelgaeste. |
| **Technologie** | `qrcode.react` oder `react-qr-code` Library fuer QR-Generierung. Responsive Webseite als Ziel-URL. Bestehende Next.js App kann eine oeffentliche Route `/menu/[standort]/[woche]` bereitstellen. Plattformen wie MENURY oder Hoteligy bieten auch fertige Loesungen. |
| **Aufwand** | **Niedrig** -- Oeffentliche Route + QR-Generierung + Responsive Design. Ca. 1 Woche Entwicklung. |
| **Mehrwert fuer Kuechenchef** | Kein manuelles Drucken/Aktualisieren von Speisekarten. Professionelles Auftreten. Gaeste koennen Allergene selbst pruefen. Funktioniert standortuebergreifend fuer JUFA City, JUFA SUED und Arbeiterkammer. |

---

#### 4. KI-Chatbot fuer Gaeste (Allergen-Auskunft & Menu-Info)

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | Ein KI-Chatbot (Web-Widget oder WhatsApp), der Gaesten rund um die Uhr Fragen zum Menuplan beantwortet: "Ist das Mittagessen am Dienstag glutenfrei?", "Welche veganen Optionen gibt es diese Woche?". Der Bot kennt alle 128 Gerichte mit Allergenen und den aktuellen Rotationsplan. Laut Branchenstudien ROI von 1.275% durch Support-Kostenersparnis. |
| **Technologie** | **OpenAI Assistants API** oder **Voiceflow** mit RAG (Retrieval Augmented Generation) auf eigener Gerichte-Datenbank. WhatsApp-Integration via **Twilio WhatsApp API** oder **Wassenger**. Web-Widget mit eigenem Chat-UI oder **Landbot**. |
| **Aufwand** | **Mittel** -- Chatbot-Logik + Datenbank-Anbindung + Channel-Integration. Ca. 2-3 Wochen. |
| **Mehrwert fuer Kuechenchef** | Entlastet Kuechenpersonal von wiederholten Allergen-Anfragen. 24/7 verfuegbar. Reduziert Haftungsrisiko durch konsistente, datenbank-gestuetzte Allergen-Auskuenfte. |

---

#### 5. Rezept-Skalierung mit KI (von 10 auf 200 Portionen)

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | Intelligente Rezept-Skalierung, die ueber einfache Multiplikation hinausgeht. KI beruecksichtigt, dass z.B. Salz bei Verdopplung nur 85% braucht, Backzeiten sich aendern, und Gewuerze nicht linear skalieren. Besonders relevant, wenn dasselbe Gericht fuer JUFA City (z.B. 80 Portionen) und Arbeiterkammer-Catering (z.B. 200 Portionen) unterschiedlich skaliert werden muss. |
| **Technologie** | **OpenAI GPT-4o API** mit spezialisierten Prompts fuer Skalierungsregeln. Alternativ: **meez API** (professionelle Kuechensoftware mit Skalierung, Yield-Berechnung, Live-Pricing). **CalcMenu** bietet ebenfalls KI-gestuetzte Skalierung. Eigene Regelengine fuer gaengige Anpassungen moeglich. |
| **Aufwand** | **Niedrig bis Mittel** -- Basis-Skalierung einfach, KI-Feintuning fuer nicht-lineare Zutaten aufwendiger. Ca. 1-2 Wochen. |
| **Mehrwert fuer Kuechenchef** | Vermeidet Fehler bei der Umrechnung fuer unterschiedliche Standort-Groessen. Spart Zeit bei der taeglichen Vorbereitung. Reduziert Lebensmittelverschwendung durch praezise Mengenangaben. |

---

### Prioritaet 2 -- Hoher Mehrwert, mittlerer Aufwand

---

#### 6. Predictive Analytics fuer Gaestezahlen

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | KI-Modell prognostiziert die erwarteten Gaestezahlen pro Standort und Tag, basierend auf historischen Daten (Felix OCR), Wochentag, Wetter, Ferienzeiten, lokalen Veranstaltungen und Feiertagen. Hotels wie Marriott berichten von 50% weniger Lebensmittelverschwendung durch praezise Vorhersagen. Ueberproduktion (20-92% des vermeidbaren Abfalls) wird drastisch reduziert. |
| **Technologie** | **Python + scikit-learn/Prophet** (Facebook/Meta Time Series Forecasting) fuer das ML-Modell. **OpenWeatherMap API** fuer Wetterdaten. **Ferien-API** (schulferien.org) fuer oesterreichische Ferienzeiten. Historische Daten aus Felix OCR als Trainingsgrundlage. |
| **Aufwand** | **Mittel bis Hoch** -- ML-Modell trainieren, mehrere Datenquellen integrieren, Genauigkeit validieren. Ca. 3-4 Wochen. |
| **Mehrwert fuer Kuechenchef** | Praezise Einkaufsplanung statt Bauchgefuehl. 20-40% weniger Lebensmittelverschwendung. Bessere Personalplanung. Besonders wertvoll fuer die schwankenden Gaestezahlen im Hotel- und Catering-Betrieb. |

---

#### 7. KI-basierte Wareneinsatz-Optimierung & Abfallreduzierung

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | System analysiert den Zusammenhang zwischen Menuplan, Einkauf und Abfall. Es erkennt, welche Zutaten standortuebergreifend gemeinsam bestellt werden koennen (Synergien JUFA City + SUED + AK), schlaegt Resteverwertungs-Rezepte vor und warnt vor drohenden Ablaufdaten. Marriott UK reduzierte Food Waste um 67% in 6 Monaten mit aehnlicher Technologie (Winnow AI). |
| **Technologie** | **Winnow AI** oder **KITRO** als Enterprise-Loesung (Kamera + Waage). Fuer die eigene App: OpenAI API fuer Resteverwertungs-Vorschlaege + eigene Bestandsdatenbank + Algorithmus fuer standortuebergreifende Einkaufsoptimierung. **Delicious Data** als deutschsprachige Alternative. |
| **Aufwand** | **Hoch** -- Erfordert Bestandsmanagement-Modul, Integration mit Lieferanten-Daten, eventuell Hardware. Ca. 4-6 Wochen. |
| **Mehrwert fuer Kuechenchef** | Signifikante Kostenreduktion (laut Studien 23-51% weniger Food Waste). Besserer Deckungsbeitrag pro Gericht. Nachhaltigkeits-Zertifizierung moeglich (z.B. PLEDGE on Food Waste). |

---

#### 8. Bildgenerierung fuer Gerichte (KI-Food-Fotografie)

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | Automatische Generierung professioneller Fotos fuer alle 128 Gerichte mittels KI -- fuer digitale Speisekarten, QR-Code-Menues und Webseiten. Statt teurem Fotoshooting generiert die KI ansprechende Food-Fotos basierend auf Gericht-Name und Beschreibung. Ueber 6.000 Restaurants nutzen bereits FoodShot AI und sparen 95% Fotografie-Kosten. |
| **Technologie** | **OpenAI DALL-E 3 API** (beste Qualitaet, kommerzielle Nutzung erlaubt). **FoodShot AI** (spezialisiert auf Food, transformiert Amateur-Fotos in Profi-Bilder in 90 Sekunden). **Recraft AI** (kostenloser Food-Image-Generator). **Adobe Firefly** (copyright-sicher). |
| **Aufwand** | **Niedrig bis Mittel** -- API-Anbindung einfach, Prompt-Optimierung fuer realistische Ergebnisse braucht Feinarbeit. Ca. 1-2 Wochen. |
| **Mehrwert fuer Kuechenchef** | Professionelle Speisekarten ohne Fotograf-Kosten. Jedes Gericht sofort visualisiert. Attraktivere Praesentation fuer Hotelgaeste und Catering-Kunden. |

---

#### 9. Food-Trend-Analyse und saisonale Empfehlungen

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | KI analysiert aktuelle Food-Trends (Fermentation, vergessene Gemuesesorten, Plant-Based, Comfort Food) und saisonale Verfuegbarkeit und schlaegt dem Kuechenchef vor, welche neuen Gerichte in die Rotation aufgenommen werden koennten. Etwa ein Drittel der Gastronomiebetriebe nutzt 2026 bereits KI fuer Menuplanung und Trend-Erkennung. |
| **Technologie** | **Tastewise API** (analysiert 4 Mio+ Menues und Millionen Nachfragesignale). **OpenAI GPT-4o** mit Web-Browsing fuer aktuelle Trend-Recherche. Saisonkalender-Datenbank fuer oesterreichische Produkte. RSS-Feeds von Gastronomie-Portalen (Falstaff, Rolling Pin). |
| **Aufwand** | **Mittel** -- Trend-Datenquellen anbinden, Empfehlungslogik bauen, UI fuer Vorschlaege. Ca. 2-3 Wochen. |
| **Mehrwert fuer Kuechenchef** | Bleibt am Puls der Zeit ohne staendig Fachmagazine zu lesen. Frische Impulse fuer die Rotation. Differenzierung gegenueber Wettbewerb. Gaeste erhalten zeitgemaesse, saisonale Kueche. |

---

### Prioritaet 3 -- Hoher Mehrwert, hoher Aufwand oder Nischen-Feature

---

#### 10. Sprachsteuerung fuer die Kueche

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | Hands-free Sprachsteuerung fuer die Kuechenarbeit: "Hey Koch, zeig mir das Rezept fuer Gericht 47", "Naechster Schritt", "Temperatur fuer Schweineschnitzel?". Besonders nuetzlich, wenn der Koch schmutzige Haende hat und keine Touchscreens bedienen kann. Sprachbefehle koennen auch HACCP-Temperaturen abfragen und Timer starten. |
| **Technologie** | **Web Speech API** (browserbasiert, kostenlos) fuer einfache Spracherkennung. **Picovoice Rhino** (on-device Speech-to-Intent, DSGVO-konform, keine Cloud noetig). **Google Cloud Speech-to-Text** oder **Whisper API** (OpenAI) fuer praezisere Erkennung. Wake-Word mit **Picovoice Porcupine** ("Hey Koch"). |
| **Aufwand** | **Hoch** -- Spracherkennung in lautem Kuechenumfeld herausfordernd, Intent-Mapping, UX-Design. Ca. 3-5 Wochen. |
| **Mehrwert fuer Kuechenchef** | Haendefreie Bedienung waehrend der Zubereitung. Schneller Zugriff auf Rezepte und HACCP-Daten. Zeitsparend im stressigen Kuechenalltag. Innovativer Wow-Faktor. |

---

#### 11. Smart Kitchen IoT Integration (HACCP-Temperatursensoren)

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | Drahtlose Temperatursensoren in Kuehlhaeusern, Warmhalte-Geraeten und beim Kochen protokollieren automatisch HACCP-relevante Temperaturen. Daten fliessen direkt in die App -- kein manuelles Logbuch mehr. Automatische SMS/E-Mail-Alerts bei Temperaturabweichungen. Auditfertige Berichte per Klick generierbar. |
| **Technologie** | **SmartSense by Digi** (Enterprise, API-Integration mit Kuechenmanagement). **Renau Smart Kitchen System** (skalierbare Sensor-Module mit Cloud). **Seemoto** (Open API, HACCP-konform). DIY: **ESP8266/ESP32 + DHT22 Sensoren** + eigene API. |
| **Aufwand** | **Hoch** -- Hardware-Beschaffung, Sensor-Installation an 3 Standorten, API-Integration, Alerting-System. Ca. 4-8 Wochen + Hardware-Kosten. |
| **Mehrwert fuer Kuechenchef** | Eliminiert manuelles HACCP-Temperaturprotokoll. Lueckenlose Dokumentation fuer Lebensmittelkontrollen. Sofortige Warnung bei Geraeteausfaellen. Enorme Zeitersparnis bei 3 Standorten. |

---

#### 12. Foto-Erkennung von Lebensmitteln fuer Bestandsaufnahme

| Eigenschaft | Detail |
|---|---|
| **Beschreibung** | Mit dem Smartphone ein Foto vom Kuehlhaus oder Lager machen, und die KI erkennt automatisch vorhandene Lebensmittel, schaetzt Mengen und aktualisiert den Bestand. Nuetzlich fuer schnelle Inventur ohne manuelles Zaehlen. Computer-Vision-Modelle wie YOLO11 ermoeglichen Echtzeit-Erkennung auch bei schwierigen Lichtverhaeltnissen. |
| **Technologie** | **Folio3 Food Recognition API** (spezialisiert auf Lebensmittel). **Ultralytics YOLO11** (Open Source Object Detection). **Google Cloud Vision API** mit eigenem Training. **Calorie Mama API** fuer Einzelgerichte. Custom-Modell mit **Roboflow** trainierbar. |
| **Aufwand** | **Hoch** -- Custom Training fuer spezifische Zutaten/Gebinde, Mengen-Schaetzung komplex, Lichtverhaeltnisse in Kuehlung. Ca. 4-6 Wochen. |
| **Mehrwert fuer Kuechenchef** | Schnelle Bestandsaufnahme per Foto statt manueller Listen. Verknuepfung mit Einkaufsplanung. Reduziert Inventurzeit drastisch. Langfristig wertvoll, aber Erkennungsgenauigkeit muss fuer den Profi-Einsatz hoch genug sein. |

---

## Uebersichtstabelle

| # | Feature | Aufwand | Mehrwert | Prioritaet |
|---|---|---|---|---|
| 1 | KI-Menuplanung & Vorschlaege | Mittel | Sehr hoch | 1 |
| 2 | Automatische Naehrwertberechnung | Niedrig | Hoch | 1 |
| 3 | Digitale Speisekarte + QR-Code | Niedrig | Hoch | 1 |
| 4 | Gaeste-Chatbot (Allergene) | Mittel | Hoch | 1 |
| 5 | KI-Rezeptskalierung | Niedrig-Mittel | Hoch | 1 |
| 6 | Predictive Analytics Gaestezahlen | Mittel-Hoch | Sehr hoch | 2 |
| 7 | Wareneinsatz-Optimierung | Hoch | Sehr hoch | 2 |
| 8 | KI-Bildgenerierung Gerichte | Niedrig-Mittel | Mittel | 2 |
| 9 | Food-Trend-Analyse | Mittel | Mittel | 2 |
| 10 | Sprachsteuerung Kueche | Hoch | Mittel | 3 |
| 11 | Smart Kitchen IoT/HACCP | Hoch | Hoch | 3 |
| 12 | Foto-Erkennung Bestand | Hoch | Mittel | 3 |

---

## Empfohlene Implementierungsreihenfolge

### Phase 1 -- Quick Wins (Wochen 1-4)
- **Naehrwertberechnung** via Edamam API (1 Woche)
- **QR-Code Speisekarte** als oeffentliche Next.js Route (1 Woche)
- **KI-Menuvorschlaege** via OpenAI API (2-3 Wochen, parallel startbar)

### Phase 2 -- Core AI (Wochen 5-10)
- **Gaeste-Chatbot** mit Allergen-Datenbank (2-3 Wochen)
- **Rezept-Skalierung** mit nicht-linearen KI-Regeln (1-2 Wochen)
- **Bildgenerierung** via DALL-E 3 fuer alle 128 Gerichte (1-2 Wochen)

### Phase 3 -- Advanced Analytics (Wochen 11-18)
- **Predictive Analytics** fuer Gaestezahlen mit historischen Felix-OCR-Daten (3-4 Wochen)
- **Wareneinsatz-Optimierung** standortuebergreifend (4-6 Wochen)
- **Food-Trend-Analyse** mit saisonalem Empfehlungssystem (2-3 Wochen)

### Phase 4 -- Innovation (nach Bedarf)
- **Sprachsteuerung** fuer die Kueche
- **IoT-Temperatursensoren** an allen 3 Standorten
- **Foto-Bestandserkennung**

---

## Geschaetzte Kosten (laufend, monatlich)

| Service | Kosten | Anmerkung |
|---|---|---|
| OpenAI API (GPT-4o + DALL-E 3) | 20-100 EUR | Je nach Nutzungsvolumen |
| Edamam Nutrition API | 0-100 EUR | Free Tier fuer Basisnutzung |
| OpenWeatherMap API | 0 EUR | Free Tier ausreichend |
| Twilio WhatsApp (Chatbot) | 10-50 EUR | Pro Nachricht ca. 0,005 EUR |
| Hosting (Vercel/Railway) | 0-20 EUR | Free Tier moeglich |
| **Gesamt Phase 1-2** | **30-270 EUR/Monat** | |

---

## Quellen

- [Fourth -- AI in Restaurants: 25 Tools](https://www.fourth.com/article/ai-in-restaurants)
- [GraceSoft -- How AI is Revolutionizing Hotel Operations](https://www.gracesoft.com/blog/hotel-software)
- [KI in der Gastronomie 2026 -- CaterMe](https://catermebyschnabls.com/ki-in-der-gastronomie/)
- [KI-Trainingszentrum -- Bedarf und Menuplanung](https://ki-trainingszentrum.com/bedarf-und-menueplanung-effizient-vorhersagen/)
- [CalcMenu -- AI-Driven Menu Engineering](https://www.calcmenu.com/en/blog-en/ai-driven-menu-engineering-revolutionizing-the-culinary-industry/)
- [Winnow AI -- Food Waste Reduction (Marriott)](https://www.soulofhospitality.com/dine-drink/trends/the-intelligent-pantry-how-hotel-kitchens-are-leveraging-ai)
- [FoodNotify -- AI against Food Waste](https://www.foodnotify.com/en/blog/ai-against-food-waste)
- [Shiji Insights -- Technology's Role in Reducing Hotel Food Waste](https://insights.shijigroup.com/technologys-role-in-reducing-hotel-food-waste/)
- [Edamam Nutrition API](https://developer.edamam.com/edamam-nutrition-api)
- [FoodShot AI -- Food Photography](https://foodshot.ai/)
- [A3Logics -- AI Food Image Generator Tools](https://www.a3logics.com/blog/ai-food-image-generator-tools/)
- [Picovoice -- AI Kitchen Assistant](https://picovoice.ai/blog/ai-powered-kitchen-assistant-for-smart-appliances/)
- [SmartSense by Digi -- Food Safety Monitoring](https://www.smartsense.co/food-service/restaurants/)
- [Tastewise -- Restaurant Industry Trends 2026](https://tastewise.io/blog/restaurant-industry-trends)
- [Voiceflow -- AI Agent for Restaurants](https://www.voiceflow.com/ai/restaurants)
- [meez -- Recipe Scaling for Chefs](https://www.getmeez.com/scaling)
- [MENURY -- Digital Menu QR-Code](https://menury.com/en/index)
- [Hoteligy -- Digital QR Hotel Menus](https://hoteligy.com/en/modules/digital-qr-hotel-menus/)
- [Folio3 -- Food Recognition API](https://www.folio3.ai/food-recognition-api/)
- [Ultralytics -- Computer Vision in Restaurants](https://www.ultralytics.com/blog/streamlining-operations-using-vision-ai-in-restaurants)
- [Delicious Data -- KI-Software Gastronomie](https://catermebyschnabls.com/ki-in-der-gastronomie/)
- [AI Chef Pro -- 15 KI-Trends Gastronomie 2026](https://blog.aichef.pro/en/ia-predicciones-2026-15-tendencias-que-cambiaran-la-gastronomia/)
