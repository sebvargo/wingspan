"use server";

import { sql } from "./db";
import { CreateGameSchema, CreatePlayerSchema } from "./schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGame(formData: FormData) {
  const rawData = {
    date: formData.get("date") || null,
    location: formData.get("location") || null,
    notes: formData.get("notes") || null,
    players: JSON.parse(formData.get("players") as string) as string[],
    results: JSON.parse(formData.get("results") as string) as Array<{
      playerUid: string;
      metricUid: string;
      score: number;
    }>,
    awards: formData.get("awards")
      ? (JSON.parse(formData.get("awards") as string) as Record<string, string>)
      : undefined,
  };

  const parsed = CreateGameSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { date, location, notes, players, results, awards } = parsed.data;
  let gameId: number;

  try {
    // Insert game
    const gameResult = await sql`
      INSERT INTO games (date, location, notes)
      VALUES (${date}, ${location}, ${notes})
      RETURNING id
    `;
    gameId = (gameResult[0] as { id: number }).id;

    // Insert game players
    for (const playerUid of players) {
      await sql`
        INSERT INTO game_players (game_id, player_uid)
        VALUES (${gameId}, ${playerUid})
      `;
    }

    // Insert results
    for (const result of results) {
      await sql`
        INSERT INTO results (game_id, player_uid, metric_uid, score)
        VALUES (${gameId}, ${result.playerUid}, ${result.metricUid}, ${result.score})
      `;
    }

    // Insert awards
    if (awards) {
      for (const [metricUid, playerUid] of Object.entries(awards)) {
        if (playerUid) {
          await sql`
            INSERT INTO results (game_id, player_uid, metric_uid, score)
            VALUES (${gameId}, ${playerUid}, ${metricUid}, 1)
          `;
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/games");
  } catch (error) {
    console.error("Error creating game:", error);
    return { error: { form: ["Failed to create game. Please try again."] } };
  }

  redirect(`/games/${gameId}`);
}

export async function createPlayer(formData: FormData) {
  const rawData = {
    uid: formData.get("uid") as string,
    displayName: formData.get("displayName") as string,
  };

  const parsed = CreatePlayerSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { uid, displayName } = parsed.data;

  try {
    await sql`
      INSERT INTO players (uid, display_name)
      VALUES (${uid}, ${displayName})
    `;

    revalidatePath("/games/new");
    return { success: true, player: { uid, display_name: displayName } };
  } catch (error) {
    console.error("Error creating player:", error);
    return { error: { form: ["Failed to create player. UID may already exist."] } };
  }
}

export async function updateGame(formData: FormData) {
  const gameIdRaw = formData.get("gameId");
  const gameId = Number(gameIdRaw);

  if (!Number.isInteger(gameId) || gameId <= 0) {
    return { error: { form: ["Invalid game id."] } };
  }

  const rawData = {
    date: formData.get("date") || null,
    location: formData.get("location") || null,
    notes: formData.get("notes") || null,
    players: JSON.parse(formData.get("players") as string) as string[],
    results: JSON.parse(formData.get("results") as string) as Array<{
      playerUid: string;
      metricUid: string;
      score: number;
    }>,
    awards: formData.get("awards")
      ? (JSON.parse(formData.get("awards") as string) as Record<string, string>)
      : undefined,
  };

  const parsed = CreateGameSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { date, location, notes, players, results, awards } = parsed.data;

  try {
    await sql`
      UPDATE games
      SET date = ${date}, location = ${location}, notes = ${notes}
      WHERE id = ${gameId}
    `;

    // Deleting game_players cascades existing results through FK.
    await sql`
      DELETE FROM game_players
      WHERE game_id = ${gameId}
    `;

    for (const playerUid of players) {
      await sql`
        INSERT INTO game_players (game_id, player_uid)
        VALUES (${gameId}, ${playerUid})
      `;
    }

    for (const result of results) {
      await sql`
        INSERT INTO results (game_id, player_uid, metric_uid, score)
        VALUES (${gameId}, ${result.playerUid}, ${result.metricUid}, ${result.score})
      `;
    }

    if (awards) {
      for (const [metricUid, playerUid] of Object.entries(awards)) {
        if (playerUid) {
          await sql`
            INSERT INTO results (game_id, player_uid, metric_uid, score)
            VALUES (${gameId}, ${playerUid}, ${metricUid}, 1)
          `;
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/games");
    revalidatePath(`/games/${gameId}`);
  } catch (error) {
    console.error("Error updating game:", error);
    return { error: { form: ["Failed to update game. Please try again."] } };
  }

  redirect(`/games/${gameId}`);
}

export async function deleteGame(gameId: number) {
  if (!Number.isInteger(gameId) || gameId <= 0) {
    return { error: { form: ["Invalid game id."] } };
  }

  try {
    await sql`
      DELETE FROM games
      WHERE id = ${gameId}
    `;

    revalidatePath("/");
    revalidatePath("/games");
  } catch (error) {
    console.error("Error deleting game:", error);
    return { error: { form: ["Failed to delete game. Please try again."] } };
  }

  redirect("/games");
}
