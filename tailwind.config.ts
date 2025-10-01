import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // WhatsApp-inspired colors (familiar to users)
        primary: {
          DEFAULT: "#25D366", // WhatsApp green
          dark: "#128C7E",
          light: "#DCF8C6",
        },
        secondary: {
          DEFAULT: "#075E54", // Dark teal
        },
      },
      fontSize: {
        // Larger base sizes for easier reading on mobile
        'base': '18px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '28px',
        '3xl': '32px',
      },
      spacing: {
        // Touch-friendly spacing (minimum 48px for buttons)
        'touch': '48px',
        'touch-lg': '56px',
      },
    },
  },
  plugins: [],
};

export default config;
