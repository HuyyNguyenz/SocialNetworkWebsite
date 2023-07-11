/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif']
    },
    extend: {
      colors: {
        'primary-color': '#425DE8',
        'dark-primary-color': '#0f90f2',
        'secondary-color': '#9F18F2',
        'bg-light': '#FFFFFF',
        'bg-dark': '#323741',
        'title-color': '#474747',
        'dark-title-color': '#b8bbbf',
        'text-color': '#3E3E3E',
        'dark-text-color': '#e4e6eb',
        'hover-color': '#EEEEEE',
        'dark-hover-color': '#2a2e35',
        'input-color': '#F9F9F9',
        'dark-input-color': '#22242a',
        'border-color': '#DADADA',
        'dark-border-color': '#242526',
        'crown-color': '#FBAB17'
      },
      fontSize: {
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px',
        28: '28px',
        32: '32px'
      },
      keyframes: {
        fade: {
          '0%': { 'margin-top': '-10px', opacity: '0' },
          '100%': { 'margin-top': '0px', opacity: '1' }
        }
      },
      animation: {
        fade: 'fade .3s ease-in-out'
      }
    }
  },
  plugins: []
}
