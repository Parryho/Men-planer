/**
 * Rotation test fixtures.
 * Minimal rotation data for week 1, Monday, city mittag.
 */
export const ROTATION_SEED_SQL = `
  INSERT INTO rotation_weeks (week_nr, day_of_week, meal, location, soup_id, main1_id, side1a_id, side1b_id, main2_id, side2a_id, side2b_id, dessert_id)
  VALUES
    (1, 1, 'mittag', 'city', 1, 2, 3, NULL, 5, 6, NULL, 7),
    (1, 1, 'mittag', 'sued', 1, 2, 3, NULL, 5, 6, NULL, 7),
    (1, 1, 'abend', 'city', 9, 8, 4, NULL, 5, 10, NULL, 7),
    (1, 1, 'abend', 'sued', 9, 8, 4, NULL, 5, 10, NULL, 7);
`;
