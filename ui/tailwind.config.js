const { nextui } = require("@nextui-org/react");


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // important: "#document-io-root",  // next UI breaks
  theme: {
    extend: {
      colors: {
        'primary': '#007d7e',
        // 'secondary': '#00c9d0',
        'secondary': '#e6f4f1',
        'accent': '#ff8749',
        'danger': "#B74606",

      },
      container: {
        center: true,
        padding: "2rem",
      },
    },
  },
  darkMode: "selector",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#007d7e",
            secondary: "#000",
            success: "#22C55E",
            warning: "#B77206",
            danger: "#B74606",
          },
        },
      }
    }),
    require('@tailwindcss/container-queries'),
  ],
}

