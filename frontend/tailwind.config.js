/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory:   '#faf7f2',
        cream:   '#f3ede3',
        warm:    '#ebe3d5',
        border:  '#e2d9cc',
        text:    '#1a1208',
        text2:   '#4a3f2f',
        muted:   '#9a8e7e',
        accent:  '#d4622a',
        accent2: '#e8954a',
        teal:    '#1a7a6e',
        teal2:   '#2a9d8f',
        purple:  '#5b4fcf',
        card:    '#131326',
        bg:      '#060611',
        surface: '#0e0e1e',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body:    ['Outfit', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px rgba(100,60,20,0.08)',
        'warm-md': '0 8px 32px rgba(100,60,20,0.12)',
        'warm-lg': '0 20px 60px rgba(100,60,20,0.16)',
      },
    },
  },
  plugins: [],
}