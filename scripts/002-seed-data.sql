-- Seed players
INSERT INTO players (uid, display_name) VALUES
  ('anne', 'Anne'),
  ('dan', 'Dan'),
  ('giedrius', 'Giedrius'),
  ('justina', 'Justina'),
  ('maria', 'Maria'),
  ('sebastian', 'Seb')
ON CONFLICT (uid) DO NOTHING;

-- Seed metrics
INSERT INTO metrics (uid, display_name, type, description, sort_order) VALUES
  ('birds', 'Birds', 'input', NULL, 1),
  ('bonus', 'Bonus Cards', 'input', NULL, 2),
  ('round', 'Round Goals', 'input', NULL, 3),
  ('eggs', 'Eggs', 'input', NULL, 4),
  ('food', 'Food', 'input', NULL, 5),
  ('tucked', 'Tucked', 'input', NULL, 6),
  ('prettiest', 'Prettiest Bird', 'award', NULL, 7),
  ('total', 'Total', 'calculated', 'Sum of all input metrics for a game', 8)
ON CONFLICT (uid) DO NOTHING;

-- Seed games and results
-- Game 1
INSERT INTO games (id, date, location, notes) VALUES (1, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (1, 'giedrius'), (1, 'sebastian'), (1, 'anne'), (1, 'maria'), (1, 'justina') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (1, 'giedrius', 'birds', 39), (1, 'sebastian', 'birds', 52), (1, 'anne', 'birds', 34), (1, 'maria', 'birds', 53), (1, 'justina', 'birds', 38),
  (1, 'giedrius', 'bonus', 3), (1, 'sebastian', 'bonus', 11), (1, 'anne', 'bonus', 0), (1, 'maria', 'bonus', 6), (1, 'justina', 'bonus', 3),
  (1, 'giedrius', 'round', 11), (1, 'sebastian', 'round', 7), (1, 'anne', 'round', 7), (1, 'maria', 'round', 5), (1, 'justina', 'round', 5),
  (1, 'giedrius', 'eggs', 19), (1, 'sebastian', 'eggs', 1), (1, 'anne', 'eggs', 37), (1, 'maria', 'eggs', 19), (1, 'justina', 'eggs', 9),
  (1, 'giedrius', 'food', 3), (1, 'sebastian', 'food', 5), (1, 'anne', 'food', 0), (1, 'maria', 'food', 3), (1, 'justina', 'food', 3),
  (1, 'giedrius', 'tucked', 6), (1, 'sebastian', 'tucked', 0), (1, 'anne', 'tucked', 0), (1, 'maria', 'tucked', 6), (1, 'justina', 'tucked', 8)
ON CONFLICT DO NOTHING;

-- Game 2
INSERT INTO games (id, date, location, notes) VALUES (2, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (2, 'giedrius'), (2, 'sebastian'), (2, 'anne'), (2, 'maria'), (2, 'dan') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (2, 'giedrius', 'birds', 35), (2, 'sebastian', 'birds', 47), (2, 'anne', 'birds', 34), (2, 'maria', 'birds', 38), (2, 'dan', 'birds', 29),
  (2, 'giedrius', 'bonus', 6), (2, 'sebastian', 'bonus', 13), (2, 'anne', 'bonus', 4), (2, 'maria', 'bonus', 4), (2, 'dan', 'bonus', 0),
  (2, 'giedrius', 'round', 1), (2, 'sebastian', 'round', 11), (2, 'anne', 'round', 8), (2, 'maria', 'round', 3), (2, 'dan', 'round', 14),
  (2, 'giedrius', 'eggs', 3), (2, 'sebastian', 'eggs', 6), (2, 'anne', 'eggs', 14), (2, 'maria', 'eggs', 7), (2, 'dan', 'eggs', 20),
  (2, 'giedrius', 'food', 9), (2, 'sebastian', 'food', 1), (2, 'anne', 'food', 7), (2, 'maria', 'food', 1), (2, 'dan', 'food', 0),
  (2, 'giedrius', 'tucked', 7), (2, 'sebastian', 'tucked', 3), (2, 'anne', 'tucked', 3), (2, 'maria', 'tucked', 3), (2, 'dan', 'tucked', 4)
ON CONFLICT DO NOTHING;

-- Game 3
INSERT INTO games (id, date, location, notes) VALUES (3, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (3, 'giedrius'), (3, 'sebastian'), (3, 'anne'), (3, 'maria'), (3, 'justina'), (3, 'dan') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (3, 'giedrius', 'birds', 24), (3, 'sebastian', 'birds', 48), (3, 'anne', 'birds', 37), (3, 'maria', 'birds', 33), (3, 'justina', 'birds', 29), (3, 'dan', 'birds', 20),
  (3, 'giedrius', 'bonus', 4), (3, 'sebastian', 'bonus', 2), (3, 'anne', 'bonus', 0), (3, 'maria', 'bonus', 6), (3, 'justina', 'bonus', 3), (3, 'dan', 'bonus', 3),
  (3, 'giedrius', 'round', 9), (3, 'sebastian', 'round', 15), (3, 'anne', 'round', 3), (3, 'maria', 'round', 4), (3, 'justina', 'round', 1), (3, 'dan', 'round', 5),
  (3, 'giedrius', 'eggs', 9), (3, 'sebastian', 'eggs', 4), (3, 'anne', 'eggs', 15), (3, 'maria', 'eggs', 15), (3, 'justina', 'eggs', 14), (3, 'dan', 'eggs', 24),
  (3, 'giedrius', 'food', 11), (3, 'sebastian', 'food', 5), (3, 'anne', 'food', 15), (3, 'maria', 'food', 0), (3, 'justina', 'food', 0), (3, 'dan', 'food', 3),
  (3, 'giedrius', 'tucked', 4), (3, 'sebastian', 'tucked', 0), (3, 'anne', 'tucked', 4), (3, 'maria', 'tucked', 18), (3, 'justina', 'tucked', 10), (3, 'dan', 'tucked', 18)
ON CONFLICT DO NOTHING;

-- Game 4
INSERT INTO games (id, date, location, notes) VALUES (4, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (4, 'giedrius'), (4, 'sebastian'), (4, 'anne'), (4, 'maria'), (4, 'dan') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (4, 'giedrius', 'birds', 53), (4, 'sebastian', 'birds', 44), (4, 'anne', 'birds', 35), (4, 'maria', 'birds', 45), (4, 'dan', 'birds', 54),
  (4, 'giedrius', 'bonus', 3), (4, 'sebastian', 'bonus', 9), (4, 'anne', 'bonus', 10), (4, 'maria', 'bonus', 0), (4, 'dan', 'bonus', 3),
  (4, 'giedrius', 'round', 8), (4, 'sebastian', 'round', 15), (4, 'anne', 'round', 3), (4, 'maria', 'round', 5), (4, 'dan', 'round', 1),
  (4, 'giedrius', 'eggs', 19), (4, 'sebastian', 'eggs', 23), (4, 'anne', 'eggs', 8), (4, 'maria', 'eggs', 22), (4, 'dan', 'eggs', 1),
  (4, 'giedrius', 'food', 0), (4, 'sebastian', 'food', 1), (4, 'anne', 'food', 11), (4, 'maria', 'food', 11), (4, 'dan', 'food', 6),
  (4, 'giedrius', 'tucked', 3), (4, 'sebastian', 'tucked', 4), (4, 'anne', 'tucked', 12), (4, 'maria', 'tucked', 11), (4, 'dan', 'tucked', 0)
ON CONFLICT DO NOTHING;

-- Game 5
INSERT INTO games (id, date, location, notes) VALUES (5, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (5, 'giedrius'), (5, 'sebastian'), (5, 'anne'), (5, 'maria'), (5, 'justina'), (5, 'dan') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (5, 'giedrius', 'birds', 33), (5, 'sebastian', 'birds', 58), (5, 'anne', 'birds', 32), (5, 'maria', 'birds', 42), (5, 'justina', 'birds', 49), (5, 'dan', 'birds', 43),
  (5, 'giedrius', 'bonus', 9), (5, 'sebastian', 'bonus', 2), (5, 'anne', 'bonus', 4), (5, 'maria', 'bonus', 3), (5, 'justina', 'bonus', 3), (5, 'dan', 'bonus', 6),
  (5, 'giedrius', 'round', 9), (5, 'sebastian', 'round', 6), (5, 'anne', 'round', 3), (5, 'maria', 'round', 5), (5, 'justina', 'round', 7), (5, 'dan', 'round', 2),
  (5, 'giedrius', 'eggs', 22), (5, 'sebastian', 'eggs', 25), (5, 'anne', 'eggs', 12), (5, 'maria', 'eggs', 18), (5, 'justina', 'eggs', 18), (5, 'dan', 'eggs', 21),
  (5, 'giedrius', 'food', 2), (5, 'sebastian', 'food', 1), (5, 'anne', 'food', 0), (5, 'maria', 'food', 0), (5, 'justina', 'food', 12), (5, 'dan', 'food', 2),
  (5, 'giedrius', 'tucked', 8), (5, 'sebastian', 'tucked', 11), (5, 'anne', 'tucked', 26), (5, 'maria', 'tucked', 17), (5, 'justina', 'tucked', 8), (5, 'dan', 'tucked', 10)
ON CONFLICT DO NOTHING;

-- Game 6
INSERT INTO games (id, date, location, notes) VALUES (6, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (6, 'giedrius'), (6, 'sebastian'), (6, 'anne'), (6, 'maria'), (6, 'dan') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (6, 'giedrius', 'birds', 46), (6, 'sebastian', 'birds', 37), (6, 'anne', 'birds', 29), (6, 'maria', 'birds', 28), (6, 'dan', 'birds', 32),
  (6, 'giedrius', 'bonus', 9), (6, 'sebastian', 'bonus', 9), (6, 'anne', 'bonus', 3), (6, 'maria', 'bonus', 8), (6, 'dan', 'bonus', 4),
  (6, 'giedrius', 'round', 3), (6, 'sebastian', 'round', 6), (6, 'anne', 'round', 2), (6, 'maria', 'round', 3), (6, 'dan', 'round', 9),
  (6, 'giedrius', 'eggs', 2), (6, 'sebastian', 'eggs', 17), (6, 'anne', 'eggs', 8), (6, 'maria', 'eggs', 18), (6, 'dan', 'eggs', 7),
  (6, 'giedrius', 'food', 2), (6, 'sebastian', 'food', 5), (6, 'anne', 'food', 10), (6, 'maria', 'food', 4), (6, 'dan', 'food', 2),
  (6, 'giedrius', 'tucked', 23), (6, 'sebastian', 'tucked', 12), (6, 'anne', 'tucked', 10), (6, 'maria', 'tucked', 12), (6, 'dan', 'tucked', 6)
ON CONFLICT DO NOTHING;

-- Game 7
INSERT INTO games (id, date, location, notes) VALUES (7, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (7, 'giedrius'), (7, 'sebastian'), (7, 'anne'), (7, 'maria'), (7, 'justina'), (7, 'dan') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (7, 'giedrius', 'birds', 27), (7, 'sebastian', 'birds', 56), (7, 'anne', 'birds', 32), (7, 'maria', 'birds', 27), (7, 'justina', 'birds', 36), (7, 'dan', 'birds', 26),
  (7, 'giedrius', 'bonus', 0), (7, 'sebastian', 'bonus', 12), (7, 'anne', 'bonus', 5), (7, 'maria', 'bonus', 5), (7, 'justina', 'bonus', 3), (7, 'dan', 'bonus', 3),
  (7, 'giedrius', 'round', 8), (7, 'sebastian', 'round', 14), (7, 'anne', 'round', 3), (7, 'maria', 'round', 5), (7, 'justina', 'round', 2), (7, 'dan', 'round', 4),
  (7, 'giedrius', 'eggs', 11), (7, 'sebastian', 'eggs', 3), (7, 'anne', 'eggs', 8), (7, 'maria', 'eggs', 10), (7, 'justina', 'eggs', 16), (7, 'dan', 'eggs', 25),
  (7, 'giedrius', 'food', 9), (7, 'sebastian', 'food', 5), (7, 'anne', 'food', 11), (7, 'maria', 'food', 4), (7, 'justina', 'food', 1), (7, 'dan', 'food', 0),
  (7, 'giedrius', 'tucked', 4), (7, 'sebastian', 'tucked', 8), (7, 'anne', 'tucked', 7), (7, 'maria', 'tucked', 7), (7, 'justina', 'tucked', 6), (7, 'dan', 'tucked', 12)
ON CONFLICT DO NOTHING;

-- Game 8
INSERT INTO games (id, date, location, notes) VALUES (8, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (8, 'giedrius'), (8, 'sebastian'), (8, 'anne'), (8, 'maria') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (8, 'giedrius', 'birds', 39), (8, 'sebastian', 'birds', 46), (8, 'anne', 'birds', 40), (8, 'maria', 'birds', 40),
  (8, 'giedrius', 'bonus', 5), (8, 'sebastian', 'bonus', 8), (8, 'anne', 'bonus', 6), (8, 'maria', 'bonus', 4),
  (8, 'giedrius', 'round', 7), (8, 'sebastian', 'round', 5), (8, 'anne', 'round', 8), (8, 'maria', 'round', 8),
  (8, 'giedrius', 'eggs', 3), (8, 'sebastian', 'eggs', 2), (8, 'anne', 'eggs', 3), (8, 'maria', 'eggs', 17),
  (8, 'giedrius', 'food', 0), (8, 'sebastian', 'food', 3), (8, 'anne', 'food', 12), (8, 'maria', 'food', 1),
  (8, 'giedrius', 'tucked', 4), (8, 'sebastian', 'tucked', 13), (8, 'anne', 'tucked', 3), (8, 'maria', 'tucked', 6)
ON CONFLICT DO NOTHING;

-- Game 9
INSERT INTO games (id, date, location, notes) VALUES (9, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (9, 'giedrius'), (9, 'sebastian'), (9, 'anne'), (9, 'maria'), (9, 'justina'), (9, 'dan') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (9, 'giedrius', 'birds', 37), (9, 'sebastian', 'birds', 55), (9, 'anne', 'birds', 26), (9, 'maria', 'birds', 27), (9, 'justina', 'birds', 44), (9, 'dan', 'birds', 27),
  (9, 'giedrius', 'bonus', 0), (9, 'sebastian', 'bonus', 6), (9, 'anne', 'bonus', 3), (9, 'maria', 'bonus', 7), (9, 'justina', 'bonus', 4), (9, 'dan', 'bonus', 6),
  (9, 'giedrius', 'round', 3), (9, 'sebastian', 'round', 7), (9, 'anne', 'round', 8), (9, 'maria', 'round', 9), (9, 'justina', 'round', 5), (9, 'dan', 'round', 4),
  (9, 'giedrius', 'eggs', 17), (9, 'sebastian', 'eggs', 9), (9, 'anne', 'eggs', 9), (9, 'maria', 'eggs', 8), (9, 'justina', 'eggs', 5), (9, 'dan', 'eggs', 7),
  (9, 'giedrius', 'food', 3), (9, 'sebastian', 'food', 6), (9, 'anne', 'food', 2), (9, 'maria', 'food', 5), (9, 'justina', 'food', 1), (9, 'dan', 'food', 3),
  (9, 'giedrius', 'tucked', 8), (9, 'sebastian', 'tucked', 2), (9, 'anne', 'tucked', 6), (9, 'maria', 'tucked', 0), (9, 'justina', 'tucked', 16), (9, 'dan', 'tucked', 6)
ON CONFLICT DO NOTHING;

-- Game 10
INSERT INTO games (id, date, location, notes) VALUES (10, NULL, NULL, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO game_players (game_id, player_uid) VALUES (10, 'giedrius'), (10, 'sebastian'), (10, 'anne'), (10, 'maria'), (10, 'justina'), (10, 'dan') ON CONFLICT DO NOTHING;
INSERT INTO results (game_id, player_uid, metric_uid, score) VALUES
  (10, 'giedrius', 'birds', 36), (10, 'sebastian', 'birds', 58), (10, 'anne', 'birds', 37), (10, 'maria', 'birds', 25), (10, 'justina', 'birds', 37), (10, 'dan', 'birds', 38),
  (10, 'giedrius', 'bonus', 7), (10, 'sebastian', 'bonus', 6), (10, 'anne', 'bonus', 4), (10, 'maria', 'bonus', 2), (10, 'justina', 'bonus', 6), (10, 'dan', 'bonus', 9),
  (10, 'giedrius', 'round', 6), (10, 'sebastian', 'round', 9), (10, 'anne', 'round', 6), (10, 'maria', 'round', 1), (10, 'justina', 'round', 5), (10, 'dan', 'round', 5),
  (10, 'giedrius', 'eggs', 11), (10, 'sebastian', 'eggs', 7), (10, 'anne', 'eggs', 17), (10, 'maria', 'eggs', 18), (10, 'justina', 'eggs', 18), (10, 'dan', 'eggs', 12),
  (10, 'giedrius', 'food', 1), (10, 'sebastian', 'food', 12), (10, 'anne', 'food', 1), (10, 'maria', 'food', 9), (10, 'justina', 'food', 0), (10, 'dan', 'food', 7),
  (10, 'giedrius', 'tucked', 11), (10, 'sebastian', 'tucked', 2), (10, 'anne', 'tucked', 8), (10, 'maria', 'tucked', 10), (10, 'justina', 'tucked', 2), (10, 'dan', 'tucked', 5)
ON CONFLICT DO NOTHING;

-- Update sequence for games
SELECT setval('games_id_seq', (SELECT MAX(id) FROM games));
