/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f9f8f4',
                    100: '#efefe0',
                    200: '#dbdbbb',
                    300: '#bbbb8b',
                    400: '#9d9d61',
                    500: '#7e7e3d',
                    600: '#62622e',
                    700: '#4a4a23',
                    800: '#3c3c1f',
                    900: '#34341d',
                    950: '#1d1d0e',
                },
                accent: {
                    gold: '#C5A059',
                    brown: '#8B5E3C',
                }
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
