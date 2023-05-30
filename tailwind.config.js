/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif']
    },
    extend: {
      colors: {
        'primary-color': '#425DE8',
        'secondary-color': '#9F18F2',
        'title-color': '#474747',
        'text-color': '#3E3E3E',
        'eeeeee-color': '#EEEEEE',
        'input-color': '#F9F9F9',
        'border-color': '#DADADA'
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
