import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import { Nav } from "@/components/layout/nav";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Flock Performance | Wingspan Score Tracker",
  description: "Track and analyze Wingspan board game scores for your group",
};

export const viewport: Viewport = {
  themeColor: "#2F2F2F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfairDisplay.variable}>
      <body className="min-h-screen bg-background antialiased">
        <Nav />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
