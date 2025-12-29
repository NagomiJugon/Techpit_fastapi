/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'node_modules/preline/dist/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('preline/plugin')
  ],
}

