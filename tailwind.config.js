/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaulttheme');
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		fontFamily: {
			sans: 'Inter, sans-serif',
		},
		screens: {
			xs: '480px',
			...defaultTheme.screens,
		},
		extend: {
			padding: {
				'16-9': '56.25%',
			},
			colors: {
				primary: '#18978F',
				'primary-dark': '#16857E',
				background: '#F8F8F8',
				'dark-grey': '#C7C7C7',
				'dark-grey60': 'rgba(199, 199, 199, 0.6)',
				subtext: '#7B7B7B',
				'light-grey': '#484848',
				'open-grey': '#A5A5A5',
			},
			fontSize: {
				10: '2.5rem',
			},
			boxShadow: {
				generic:
					'0px 100px 80px rgba(112, 112, 112, 0.07), 0px 41.7776px 33.4221px rgba(112, 112, 112, 0.0503198), 0px 22.3363px 17.869px rgba(112, 112, 112, 0.0417275), 0px 12.5216px 10.0172px rgba(112, 112, 112, 0.035), 0px 6.6501px 5.32008px rgba(112, 112, 112, 0.0282725), 0px 2.76726px 2.21381px rgba(112, 112, 112, 0.0196802);',
			},
			borderWidth: {
				6: '6px',
			},

			maxHeight: {
				75: '75vh',
				90: '90vh',
			},
		},
	},
	plugins: [],
};
