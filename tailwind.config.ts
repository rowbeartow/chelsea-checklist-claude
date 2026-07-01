import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        cloud: "#f6f6f6",
        plaster: "#fafafa",
        stone: "#e5e5e5",
        moss: "#111111",
        sage: "#737373",
        leaf: "#eeeeee",
        accent: "#166534",
        accentSoft: "#f0fdf4",
        clay: "#166534",
        success: "#15803d",
        successSoft: "#dcfce7",
        warning: "#ca8a04",
        warningSoft: "#fef3c7",
        danger: "#dc2626",
        dangerSoft: "#fee2e2",
        brass: "#a3a3a3",
        butter: "#e5e5e5",
        line: "#dedede"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(17, 17, 17, 0.07)"
      }
    }
  },
  plugins: []
};

export default config;
