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
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // McKinsey Deep Blue palette
        mck: {
          blue: {
            50: '#e8f4fc',
            100: '#d1e9f9',
            200: '#a3d3f3',
            300: '#75bded',
            400: '#47a7e7',
            500: '#0077b6', // Primary McKinsey blue
            600: '#005f92',
            700: '#00476e',
            800: '#002f4a',
            900: '#001726',
            950: '#000b13',
          },
          // Electric blue accent for interactive elements
          electric: {
            400: '#2196f3',
            500: '#1976d2',
            600: '#1565c0',
          },
        },
        // Surface colors - light theme
        surface: {
          primary: '#ffffff',
          secondary: '#f8f9fa',
          tertiary: '#f1f3f4',
          border: '#e0e0e0',
          borderLight: '#eeeeee',
        },
        // Text colors
        text: {
          primary: '#1a1a1a',
          secondary: '#4a4a4a',
          tertiary: '#6b6b6b',
          muted: '#9e9e9e',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typing: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        'mck': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'mck-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'mck-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
