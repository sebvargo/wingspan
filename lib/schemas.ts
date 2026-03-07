import { z } from "zod";

export const CreateGameSchema = z.object({
  date: z.string().nullable(),
  location: z.string().max(100).nullable(),
  notes: z.string().max(500).nullable(),
  players: z.array(z.string()).min(1, "At least one player required"),
  results: z.array(
    z.object({
      playerUid: z.string(),
      metricUid: z.string(),
      score: z.number().int().nonnegative(),
    })
  ),
  awards: z.record(z.string(), z.string()).optional(),
});

export type CreateGameInput = z.infer<typeof CreateGameSchema>;

export const CreatePlayerSchema = z.object({
  uid: z
    .string()
    .min(1, "UID is required")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "UID must be lowercase letters, numbers, and hyphens only"),
  displayName: z.string().min(1, "Display name is required").max(50),
});

export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;
