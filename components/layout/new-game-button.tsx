"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";

export function NewGameButton() {
  function handleClick(): void {
    posthog.capture("new_game_clicked", {
      source: "header_cta",
    });
  }

  return (
    <Link href="/games/new" className="ml-auto" onClick={handleClick}>
      <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Game
      </Button>
    </Link>
  );
}
