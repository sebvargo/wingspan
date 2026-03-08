import { AppSidebar } from "@/components/app-sidebar";
import { SidebarBreadcrumbs } from "@/components/layout/sidebar-breadcrumbs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAppCounts } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Rookery | Wingspan Score Tracker",
  description: "Track and analyze Wingspan board game scores for your group",
};

export const viewport: Viewport = {
  themeColor: "#223938",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { playerCount, gameCount } = await getAppCounts();

  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        inter.variable,
        jetBrainsMono.variable,
        playfairDisplay.variable,
      )}
    >
      <body className="min-h-screen bg-background antialiased">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar playerCount={playerCount} gameCount={gameCount} />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-4" />
                <SidebarBreadcrumbs />
                <Link href="/games/new" className="ml-auto">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Game
                  </Button>
                </Link>
              </header>
              <div className="flex flex-1 flex-col p-4 md:p-6">
                <main className="w-full">{children}</main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
