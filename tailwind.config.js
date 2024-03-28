/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ozip-blue": "#35C5F0",
        "naver-green": "#03c75a",
        "kakao-yellow": "#ffcd36",
      },
      gap: {
        "18-px": "18px",
      },
      width: {
        250: "250px",
        1100: "1100px",
        1280: "1280px",
        1360: "1360px",
      },
      height: {
        180: "180px",
      },
      zIndex: {
        101: "101",
      },
      textShadow: {
        sm: "0 0 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },
    minWidth: {
      "1/2": "50%",
      200: "200px",
      800: "800px",
      925: "925px",
      1024: "1024px",
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
  ],
};
