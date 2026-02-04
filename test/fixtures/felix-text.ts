/**
 * Real-world OCR output fixtures for felix-parser tests.
 * Based on actual Felix Pensionsliste screenshots.
 */

// Full 7-column output with all columns present
export const FELIX_7_COLUMNS = `Pensionsliste JUFA Hotel Graz City
von 03.02.25 bis 09.02.25

Tag     Datum      Ges.  Frühst  KP Vorm  Mittag  KP Nach  Abend E  Abend K
Mo  03.02.25  Ges.  85  72  5  35  0  28  12
Di  04.02.25  Ges.  92  80  8  42  3  31  15
Mi  05.02.25  Ges.  78  65  0  30  0  25  10
Do  06.02.25  Ges.  88  75  6  38  2  30  14
Fr  07.02.25  Ges.  95  82  10  45  5  35  18`;

// 6-column output (missing AbendE, common when no adult dinner guests)
export const FELIX_6_COLUMNS = `Pensionsliste JUFA Hotel Graz City
von 10.02.25 bis 14.02.25

Mo  10.02.25  Ges.  65  55  3  28  0  8
Di  11.02.25  Ges.  70  60  5  32  2  10
Mi  12.02.25  Ges.  58  48  0  22  0  6`;

// 5-column output (no KP columns)
export const FELIX_5_COLUMNS = `Pensionsliste
Mo  17.02.25  Ges.  85  72  35  28  12
Di  18.02.25  Ges.  92  80  42  31  15`;

// OCR with errors (O→0, l→1, etc.) - date must be valid for parser to pick it up
export const FELIX_OCR_ERRORS = `Pensionsliste JUFA Hotel Graz City
Er  21.02.25  Ges.  95  82  1O  45  5  35  l8`;

// SUED hotel
export const FELIX_SUED = `Pensionsliste JUFA Hotel Graz Süd
von 03.02.25 bis 07.02.25

Mo  03.02.25  Ges.  45  38  0  18  0  12  5
Di  04.02.25  Ges.  52  42  3  22  0  15  8`;

// Minimal data (3 numbers)
export const FELIX_MINIMAL = `Mo  03.02.25  Ges.  45  38  18`;

// Empty / noise only
export const FELIX_NOISE = `Some random text
No dates here
Just noise`;
