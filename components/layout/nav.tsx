"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bird, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/games", label: "Games" },
  { href: "/players", label: "Players" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-charcoal text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Bird className="h-6 w-6 text-sky-blue" />
          <span className="font-serif text-lg font-semibold">Flock Performance</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = item.href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors hover:text-sky-blue",
                  isActive && "text-sky-blue"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-sky-blue" />
                )}
              </Link>
            );
          })}

          <Link
            href="/games/new"
            className="flex items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral/90"
          >
            <Plus className="h-4 w-4" />
            New Game
          </Link>
        </nav>
      </div>
    </header>
  );
}
