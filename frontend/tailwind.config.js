/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        geist: ["'Geist'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#004ac6",
          container: "#2563eb",
          dark: "#003ea8",
        },
        surface: {
          DEFAULT: "#faf8ff",
          low: "#f2f3ff",
          container: "#eaedff",
          high: "#e2e7ff",
          highest: "#dae2fd",
          dim: "#d2d9f4",
        },
        "on-surface": "#131b2e",
        "on-surface-variant": "#434655",
        outline: "#737686",
        "outline-variant": "#c3c6d7",
        tertiary: {
          DEFAULT: "#006229",
          container: "#007e37",
        },
        error: "#ba1a1a",
      },
    },
  },
  plugins: [],
};
