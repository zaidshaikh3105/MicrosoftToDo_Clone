import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Vite's typical file structure
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Segoe UI", "sans-serif"],
      },
      colors: {
        "text-color": "#333333",
      },
    },
  },
};
