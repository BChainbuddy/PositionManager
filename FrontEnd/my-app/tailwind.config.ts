import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        interBold: ["var(--font-interBold)"],
        inter: ["var(--font-inter)"],
        jura: ["var(--font-jura)"],
        juraBold: ["var(--font-juraBold)"]
      },
    },
  },
  plugins: [],
};
export default config;
