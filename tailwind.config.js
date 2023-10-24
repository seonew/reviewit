/** @type {import('tailwindcss').Config} */
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
    },
    minWidth: {
      "1/2": "50%",
      200: "200px",
      925: "925px",
      1024: "1024px",
    },
  },
  plugins: [],
};
