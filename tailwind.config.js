/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'game-bg': '#f0f4f8',
                'game-dark-bg': '#0f172a',
                'correct': '#22c55e',
                'present': '#eab308',
                'absent': '#94a3b8',
                'primary': '#6366f1',
            },
            fontFamily: {
                sans: ['Noto Sans KR', 'sans-serif'],
            },
            animation: {
                'scale-in': 'scaleIn 0.3s ease-out forwards',
            },
            keyframes: {
                scaleIn: {
                    'from': { transform: 'scale(0.9)', opacity: '0' },
                    'to': { transform: 'scale(1)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
