/** @type {import('tailwindcss').Config} */

// tailwind.config.js
import theme from "./src/style/theme";

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],

  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
      },
      fontFamily: {
        sans: theme.fontFamily.sans,
      },
    },
  },
  plugins: [require("flowbite/plugin")],

  // ...rest of your Tailwind CSS configuration
};
