/* eslint-env node */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#EA7C69",
        dark: "#252836",
        "dark-second": "#1F1D2B",
        "dark-3": "#1F1D2B",
      },
      colors: {
        primary: "#EA7C69",
      },
      gridTemplateColumns: {
        192: "repeat(auto-fill, 12rem)",
      },
    },
  },
  plugins: [],
};
