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
        brand: {
          DEFAULT: "#ec4899",
          light: "#f472b6",
          dark: "#db2777",
        },
      },
      fontFamily: {
        poppins: "var(--font-poppins)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in-up-main": {
          "0%": { opacity: "0", transform: "translateY(600px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-in-btn1": {
          "0%": { opacity: "0", transform: "translateY(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-in-btn2": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-left": {
         "0%": { opacity: "0", transform: "translateX(120px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
         "0%": { opacity: "0", transform: "translateX(-80px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up-main 1.2s ease-out both",
        "fade-in-line": "fade-in-in-btn2 1.2s ease-out both",
        "fade-in-in1": "fade-in-in-btn1 0.8s ease-out both",
        "fade-in-in2": "fade-in-in-btn2 0.8s ease-out both",
        "fade-in-left": "fade-in-left 0.8s ease-out both",
        "fade-in-right": "fade-in-right 0.8s ease-out both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
