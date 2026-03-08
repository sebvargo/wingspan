"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = {
  href: string;
  label: string;
};

function getSubtitle(pathname: string): string {
  if (pathname === "/") {
    return "Overview of your Wingspan game history and player statistics";
  }
  if (pathname === "/games") {
    return "Browse all recorded games";
  }
  if (pathname === "/games/new") {
    return "Record the scores from your latest game";
  }
  if (/^\/games\/[^/]+\/edit$/.test(pathname)) {
    return "Update players, scores, and game details";
  }
  if (/^\/games\/[^/]+$/.test(pathname)) {
    return "Game details, score breakdown, and player context";
  }
  if (pathname === "/players") {
    return "View profiles and statistics for all players";
  }
  if (/^\/players\/[^/]+$/.test(pathname)) {
    return "Player profile, performance trends, and game history";
  }
  return "";
}

const staticLabels: Record<string, string> = {
  games: "Games",
  new: "New Game",
  edit: "Edit",
  players: "Players",
};

function toTitleCase(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSegmentLabel(segment: string): string {
  return staticLabels[segment] ?? toTitleCase(segment);
}

function buildCrumbs(pathname: string): Crumb[] {
  if (pathname === "/") {
    return [{ href: "/", label: "Dashboard" }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ href: "/", label: "Dashboard" }];

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    crumbs.push({
      href,
      label: getSegmentLabel(segment),
    });
  });

  return crumbs;
}

export function SidebarBreadcrumbs() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);
  const lastIndex = crumbs.length - 1;
  const subtitle = getSubtitle(pathname);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === lastIndex;
            return (
              <Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={crumb.href} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast ? <BreadcrumbSeparator /> : null}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {subtitle ? (
        <p className="hidden truncate text-sm text-muted-foreground md:block">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
