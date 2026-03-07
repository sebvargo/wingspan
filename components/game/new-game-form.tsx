"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScoreEntryGrid } from "./score-entry-grid";
import { createGame, createPlayer } from "@/lib/actions";
import { X, Plus, Loader2 } from "lucide-react";
import type { Player, Metric } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NewGameFormProps {
  allPlayers: Player[];
  metrics: Metric[];
  playerStats: Record<string, { avgScore: number; gamesPlayed: number; wins: number }>;
}

export function NewGameForm({ allPlayers, metrics, playerStats }: NewGameFormProps) {
  const [players, setPlayers] = useState<Player[]>(allPlayers);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  const [awards, setAwards] = useState<Record<string, string>>({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPlayerForm, setShowNewPlayerForm] = useState(false);
  const [newPlayerUid, setNewPlayerUid] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);

  const handleTogglePlayer = (player: Player) => {
    setSelectedPlayers((prev) =>
      prev.some((p) => p.uid === player.uid)
        ? prev.filter((p) => p.uid !== player.uid)
        : [...prev, player]
    );
  };

  const handleRemovePlayer = (playerUid: string) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.uid !== playerUid));
  };

  const handleScoresChange = useCallback(
    (newScores: Record<string, Record<string, number>>) => {
      setScores(newScores);
    },
    []
  );

  const handleAwardsChange = useCallback(
    (newAwards: Record<string, string>) => {
      setAwards(newAwards);
    },
    []
  );

  const handleAddNewPlayer = async () => {
    if (!newPlayerUid || !newPlayerName) return;

    setIsAddingPlayer(true);
    const formData = new FormData();
    formData.set("uid", newPlayerUid.toLowerCase().replace(/\s+/g, "-"));
    formData.set("displayName", newPlayerName);

    const result = await createPlayer(formData);

    if (result.error) {
      setError(Object.values(result.error).flat().join(", "));
    } else if (result.player) {
      const newPlayer = result.player as Player;
      setPlayers((prev) => [...prev, newPlayer]);
      setSelectedPlayers((prev) => [...prev, newPlayer]);
      setNewPlayerUid("");
      setNewPlayerName("");
      setShowNewPlayerForm(false);
    }
    setIsAddingPlayer(false);
  };

  const handleSubmit = async () => {
    if (selectedPlayers.length === 0) {
      setError("Please select at least one player");
      return;
    }

    // Validate all scores are filled
    const inputMetrics = metrics.filter((m) => m.type === "input");
    for (const player of selectedPlayers) {
      for (const metric of inputMetrics) {
        if (scores[player.uid]?.[metric.uid] === undefined) {
          setError(`Missing score for ${player.display_name} - ${metric.display_name}`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set("date", date || "");
    formData.set("location", location);
    formData.set("notes", notes);
    formData.set("players", JSON.stringify(selectedPlayers.map((p) => p.uid)));

    const results: Array<{ playerUid: string; metricUid: string; score: number }> = [];
    for (const player of selectedPlayers) {
      for (const metric of inputMetrics) {
        results.push({
          playerUid: player.uid,
          metricUid: metric.uid,
          score: scores[player.uid]?.[metric.uid] ?? 0,
        });
      }
    }
    formData.set("results", JSON.stringify(results));
    formData.set("awards", JSON.stringify(awards));

    const result = await createGame(formData);

    if (result?.error) {
      setError(
        typeof result.error === "object"
          ? Object.values(result.error).flat().join(", ")
          : "An error occurred"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Game Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">
                  Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">
                  Location
                </label>
                <Input
                  placeholder="Where was the game played?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal">
                Notes
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-wing-brown/30 bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-blue focus-visible:ring-offset-2"
                placeholder="Any notes about this game..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Players</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {players.map((player) => {
                const isSelected = selectedPlayers.some((p) => p.uid === player.uid);
                return (
                  <button
                    key={player.uid}
                    onClick={() => handleTogglePlayer(player)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-sky-blue text-white"
                        : "bg-pale-aqua text-charcoal hover:bg-turquoise/30"
                    )}
                  >
                    {player.display_name}
                  </button>
                );
              })}
              <button
                onClick={() => setShowNewPlayerForm(true)}
                className="flex items-center gap-1 rounded-full border-2 border-dashed border-wing-brown/30 px-4 py-2 text-sm font-medium text-wing-brown transition-colors hover:border-sky-blue hover:text-sky-blue"
              >
                <Plus className="h-4 w-4" />
                Add Player
              </button>
            </div>

            {showNewPlayerForm && (
              <div className="rounded-lg bg-pale-aqua/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">New Player</span>
                  <button
                    onClick={() => setShowNewPlayerForm(false)}
                    className="text-wing-brown hover:text-charcoal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Display name"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                  />
                  <Input
                    placeholder="UID (e.g., john)"
                    value={newPlayerUid}
                    onChange={(e) => setNewPlayerUid(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddNewPlayer}
                  disabled={isAddingPlayer || !newPlayerName || !newPlayerUid}
                  className="mt-3"
                  size="sm"
                >
                  {isAddingPlayer && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Player
                </Button>
              </div>
            )}

            {selectedPlayers.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-wing-brown">
                  Selected ({selectedPlayers.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedPlayers.map((player) => (
                    <Badge
                      key={player.uid}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {player.display_name}
                      <button
                        onClick={() => handleRemovePlayer(player.uid)}
                        className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedPlayers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreEntryGrid
                players={selectedPlayers}
                metrics={metrics}
                onScoresChange={handleScoresChange}
                onAwardsChange={handleAwardsChange}
              />
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="rounded-lg bg-coral/10 p-4 text-sm text-coral">{error}</div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedPlayers.length === 0}
          className="w-full"
          size="lg"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Game
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Player Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlayers.length === 0 ? (
              <p className="text-sm text-wing-brown">
                Select players to see their historical stats
              </p>
            ) : (
              selectedPlayers.map((player) => {
                const stats = playerStats[player.uid];
                return (
                  <div
                    key={player.uid}
                    className="rounded-lg bg-pale-aqua/50 p-3"
                  >
                    <p className="font-medium text-charcoal">
                      {player.display_name}
                    </p>
                    {stats ? (
                      <div className="mt-1 text-sm text-wing-brown">
                        <p>
                          {stats.gamesPlayed} games, {stats.wins} wins
                        </p>
                        <p>Avg: {Math.round(stats.avgScore * 10) / 10}</p>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-wing-brown">No games yet</p>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
