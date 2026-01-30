/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        // Custom energy-themed colors beyond Tailwind defaults
        energy: {
          wti: '#3B82F6',      // blue-500
          brent: '#8B5CF6',    // violet-500
          gas: '#F97316',      // orange-500
          opec: '#14B8A6',     // teal-500
        },
      },
    },
  },
  plugins: [],
}
