/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkblue: "#043A58",
        green: "#6DAB3C",
        "dark-green": "#4d8129",
        semiPrimary: "#94c714",
      },
    },
    variants: {
      textColor: ["responsive", "hover", "focus", "group-hover"],
      visibility: ["group-hover"],
    },
  },
  plugins: [],
};
