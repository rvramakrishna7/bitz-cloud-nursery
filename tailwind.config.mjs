/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="night"]'],
  theme: {
    extend: {
      colors: {
        cream: "var(--bg-cream)",
        card: "var(--bg-card)",
        espresso: "var(--text-espresso)",
        muted: "var(--text-muted)",
        berry: "var(--accent-berry)",
        pink: "var(--accent-pink)",
        gold: "var(--accent-gold)",
        sky: "var(--accent-sky)",
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        cozy: "0 8px 30px -4px rgba(163, 64, 99, 0.12)",
        chunky: "0 4px 0 0 var(--border-chunky)",
        "chunky-sm": "0 2px 0 0 var(--border-chunky)",
      },
    },
  },
  plugins: [],
};
