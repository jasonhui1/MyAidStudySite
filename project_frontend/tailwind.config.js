/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  // These paths are just examples, customize them to match your project structure
  purge: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "primary-color-hover": "var(--primary-color-hover)"
      },
    },
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'rotate(-10deg)' },
        '50%': { transform: 'rotate(10deg)' },
      },

      clipInLeft: {
        '0%': { clipPath: 'inset(0% 100% 0% 0%)' },
        '100%': { clipPath: 'inset(0%)' },
      },

      galleryShiftUp: {
        '0%': { translate: '0 80%', opacity: '0%', transform: `skewY(12deg)` },
        '100%': { translate: '0 0', opacity: '100%', transform: `skewY(0)` },
      },

      fadeIn: {
        '0%': { opacity: '0%' },
        '100%': { opacity: '100%' },
      },

      // translateIn36:{
      //   '0%': {translate: '0px'},
      //   '100%': {translate: '-9rem'}
      // }
    },
    animation: {
      wiggle: 'wiggle 1s ease-in-out infinite',
      fadeIn: 'fadeIn 1s ease-in-out',
      clipInLeft: 'clipInLeft 0.75s ease-in-out',
      galleryShiftUp: 'galleryShiftUp 1200ms cubic-bezier(.86,0,.07,1)',
      // translateIn36: 'translateIn36 0.5s ease-in-out'
    }
  },
  plugins: [require("daisyui"),
  ],
}
