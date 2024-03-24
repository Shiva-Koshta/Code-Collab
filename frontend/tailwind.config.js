/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        bounceLeft: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-10px)' }
        },
        bounceRight: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' }
        }
      },
      animation: {
        'bounce-left': 'bounceLeft 1s infinite',
        'bounce-right': 'bounceRight 1s infinite'
      }
    }
  },
  plugins: [],
}

