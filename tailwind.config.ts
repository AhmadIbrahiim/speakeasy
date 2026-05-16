import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "ui-serif", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        cream: {
          50: "#FBF7EE",
          100: "#F5EFE3",
          200: "#EDE6D6",
          300: "#E3D9C2",
        },
        ink: "#1A1916",
        accent: {
          DEFAULT: "#E64A2B",
          warm: "#F5A623",
          forest: "#2D7A3E",
        },
      },
      boxShadow: {
        ink: "4px 4px 0 #1A1916",
        "ink-lg": "6px 6px 0 #1A1916",
        "ink-xl": "8px 8px 0 #1A1916",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
