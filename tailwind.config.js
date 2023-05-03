/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif']
    },
    extend: {
      colors: {
        'primary-color': '#4661EA',
        'secondary-color': '#9F18F2',
        'title-color': '#000000',
        'eeeeee-color': '#EEEEEE',
        'input-color': '#F5F6F7',
        'border-input-color': '#CCD0D5'
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
      }
    }
  },
  plugins: []
}
