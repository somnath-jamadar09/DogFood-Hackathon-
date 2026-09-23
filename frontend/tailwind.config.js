/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#0B0F17',
        surface: {
          DEFAULT: '#111827',
          raised: '#1F2937',
        },
        subtle: '#374151',
        primary: '#F9FAFB',
        secondary: '#9CA3AF',
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          glow: 'rgba(59, 130, 246, 0.25)',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          offline: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
        glow: '0 0 15px rgba(59, 130, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
