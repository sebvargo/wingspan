-- Wingspan Score Tracker Database Schema

-- Players table
CREATE TABLE IF NOT EXISTS players (
  uid VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL UNIQUE
);

-- Metrics table (scoring categories)
CREATE TABLE IF NOT EXISTS metrics (
  uid VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('input', 'calculated', 'award')),
  description TEXT,
  sort_order INTEGER NOT NULL
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  date DATE,
  location VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GamePlayer junction table (tracks participation)
CREATE TABLE IF NOT EXISTS game_players (
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_uid VARCHAR(50) NOT NULL REFERENCES players(uid) ON DELETE CASCADE,
  seat_order INTEGER,
  PRIMARY KEY (game_id, player_uid)
);

-- Results table (scores)
CREATE TABLE IF NOT EXISTS results (
  game_id INTEGER NOT NULL,
  player_uid VARCHAR(50) NOT NULL,
  metric_uid VARCHAR(50) NOT NULL REFERENCES metrics(uid) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  PRIMARY KEY (game_id, player_uid, metric_uid),
  FOREIGN KEY (game_id, player_uid) REFERENCES game_players(game_id, player_uid) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_players_player ON game_players(player_uid);
CREATE INDEX IF NOT EXISTS idx_results_game ON results(game_id);
CREATE INDEX IF NOT EXISTS idx_results_player ON results(player_uid);
CREATE INDEX IF NOT EXISTS idx_results_metric ON results(metric_uid);
