"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteGame } from "@/lib/actions";

interface DeleteGameButtonProps {
  gameId: number;
  size?: "default" | "sm" | "lg" | "icon";
}

export function DeleteGameButton({ gameId, size = "default" }: DeleteGameButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete this game? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteGame(gameId);
    });
  };

  return (
    <Button
      variant="destructive"
      size={size}
      onClick={handleDelete}
      disabled={isPending}
      className="gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete Game"}
    </Button>
  );
}
