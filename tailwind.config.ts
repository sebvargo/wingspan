import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "sky-blue": "#4FA3D9",
        "turquoise": "#79C6C4",
        "pale-aqua": "#D7ECE8",
        "coral": "#F26A5A",
        "peach": "#F5A27F",
        "wing-brown": "#7A6A5C",
        "charcoal": "#2F2F2F",
        background: "#D7ECE8",
        foreground: "#2F2F2F",
        card: "#FFFFFF",
        "card-foreground": "#2F2F2F",
        primary: "#4FA3D9",
        "primary-foreground": "#FFFFFF",
        secondary: "#79C6C4",
        "secondary-foreground": "#FFFFFF",
        destructive: "#F26A5A",
        "destructive-foreground": "#FFFFFF",
        muted: "#7A6A5C",
        "muted-foreground": "#7A6A5C",
        accent: "#F5A27F",
        "accent-foreground": "#2F2F2F",
        border: "#D7ECE8",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
