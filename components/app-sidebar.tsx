"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Bird, LayoutDashboard, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Games",
    href: "/games",
    icon: Trophy,
  },
  {
    title: "Players",
    href: "/players",
    icon: Users,
  },
];

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

interface AppSidebarProps {
  playerCount: number;
  gameCount: number;
}

export function AppSidebar({ playerCount, gameCount }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger
                openOnHover
                delay={300}
                closeDelay={0}
                render={
                  <SidebarMenuButton
                    className="h-10 font-serif text-base font-semibold"
                  >
                    <Bird className="text-sidebar-primary" />
                    <span>Rookery</span>
                  </SidebarMenuButton>
                }
              />
              <PopoverContent side="right" align="start" sideOffset={10} className="max-w-sm">
                <div className="space-y-2">
                  <h3 className="font-serif text-base font-semibold leading-none">Rookery</h3>
                  <p className="text-xs italic text-muted-foreground">
                    rookery /rook-uh-ree/ - a colony of breeding birds; a noisy, crowded
                    gathering place.
                  </p>
                  <p className="text-sm leading-relaxed">
                    A Wingspan board game score tracker for recording games, browsing
                    stats, and settling arguments about who&apos;s really the best birder.
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Tracking {playerCount} players across {gameCount} games
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isItemActive(pathname, item.href)}
                      render={<Link href={item.href} />}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
