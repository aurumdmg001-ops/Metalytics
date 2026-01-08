import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // THIS IS IMPORTANT
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ... rest of your config
};
export default config;