const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['18px', '28px'],
      xl: ['20px', '28px'],
      '2xl': ['24px', '32px'],
      '3xl': ['30px', '36px'],
      '4xl': ['36px', '40px'],
      '5xl': ['48px', '48px'],
      '6xl': ['64px', 1],
      '7xl': ['72px', 1],
      '8xl': ['96px', 1],
    },
    // https://github.com/tailwindlabs/tailwindcss/issues/1232#issuecomment-754804258
    spacing: {
      px: '1px',
      0: '0',
      0.5: '2px',
      1: '4px',
      1.5: '6px',
      2: '8px',
      2.5: '10px',
      3: '12px',
      3.5: '14px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      14: '56px',
      16: '64px',
      20: '80px',
      24: '96px',
      28: '112px',
      32: '128px',
      36: '144px',
      40: '160px',
      44: '176px',
      48: '192px',
      52: '208px',
      56: '224px',
      60: '240px',
      64: '256px',
      72: '288px',
      80: '320px',
      96: '384px',
    },
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
    require('tailwind-scrollbar'),
  ],
}

