import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import postgres from 'postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function parseEnvFile(content) {
  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const eqIndex = line.indexOf('=');
    if (eqIndex <= 0) {
      continue;
    }

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const candidatePaths = [
    path.join(projectRoot, '.env.local'),
    path.join(projectRoot, '.env'),
  ];

  for (const envPath of candidatePaths) {
    try {
      const raw = await fs.readFile(envPath, 'utf8');
      const parsed = parseEnvFile(raw);
      if (parsed.DATABASE_URL) {
        process.env.DATABASE_URL = parsed.DATABASE_URL;
        return parsed.DATABASE_URL;
      }
    } catch (error) {
      if (error && typeof error === 'object' && error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    'DATABASE_URL is not set. Provide it in the environment or .env.local'
  );
}

async function loadSeedData() {
  const seedPath = path.join(projectRoot, 'seed-data.json');
  const raw = await fs.readFile(seedPath, 'utf8');
  return JSON.parse(raw);
}

async function seedDatabase(reset = true) {
  const databaseUrl = await loadDatabaseUrl();
  const seed = await loadSeedData();
  const sql = postgres(databaseUrl);

  try {
    await sql.begin(async (tx) => {
      if (reset) {
        await tx`
          TRUNCATE TABLE results, game_players, games, metrics, players
          RESTART IDENTITY CASCADE
        `;
      }

      for (const player of seed.players) {
        await tx`
          INSERT INTO players (uid, display_name)
          VALUES (${player.uid}, ${player.displayName})
          ON CONFLICT (uid) DO UPDATE
          SET display_name = EXCLUDED.display_name
        `;
      }

      for (const metric of seed.metrics) {
        await tx`
          INSERT INTO metrics (uid, display_name, type, description, sort_order)
          VALUES (
            ${metric.uid},
            ${metric.displayName},
            ${metric.type},
            ${metric.description},
            ${metric.sortOrder}
          )
          ON CONFLICT (uid) DO UPDATE
          SET
            display_name = EXCLUDED.display_name,
            type = EXCLUDED.type,
            description = EXCLUDED.description,
            sort_order = EXCLUDED.sort_order
        `;
      }

      for (const game of seed.games) {
        await tx`
          INSERT INTO games (id, date, location, notes)
          VALUES (${game.id}, ${game.date}, ${game.location}, ${game.notes})
          ON CONFLICT (id) DO UPDATE
          SET
            date = EXCLUDED.date,
            location = EXCLUDED.location,
            notes = EXCLUDED.notes
        `;

        for (let index = 0; index < game.players.length; index += 1) {
          const playerUid = game.players[index];
          await tx`
            INSERT INTO game_players (game_id, player_uid, seat_order)
            VALUES (${game.id}, ${playerUid}, ${index + 1})
            ON CONFLICT (game_id, player_uid) DO UPDATE
            SET seat_order = EXCLUDED.seat_order
          `;
        }

        for (const result of game.results) {
          await tx`
            INSERT INTO results (game_id, player_uid, metric_uid, score)
            VALUES (
              ${game.id},
              ${result.playerUid},
              ${result.metricUid},
              ${result.score}
            )
            ON CONFLICT (game_id, player_uid, metric_uid) DO UPDATE
            SET score = EXCLUDED.score
          `;
        }

        if (game.awards) {
          for (const [metricUid, playerUid] of Object.entries(game.awards)) {
            if (!playerUid) {
              continue;
            }
            await tx`
              INSERT INTO results (game_id, player_uid, metric_uid, score)
              VALUES (${game.id}, ${playerUid}, ${metricUid}, 1)
              ON CONFLICT (game_id, player_uid, metric_uid) DO UPDATE
              SET score = EXCLUDED.score
            `;
          }
        }
      }

      await tx`
        SELECT setval(
          'games_id_seq',
          COALESCE((SELECT MAX(id) FROM games), 1),
          true
        )
      `;
    });

    console.log(
      `Seed complete: ${seed.players.length} players, ${seed.metrics.length} metrics, ${seed.games.length} games`
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

const shouldReset = !process.argv.includes('--no-reset');
await seedDatabase(shouldReset);
