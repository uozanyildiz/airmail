import React, { useEffect } from 'react';

const useDarkMode = () => {
	const [darkMode, setDarkMode] = React.useState(false);

	useEffect(() => {
		const darkMode = localStorage.getItem('darkMode') === 'true';
		setDarkMode(darkMode);
	}, []);

	useEffect(() => {
		localStorage.setItem('darkMode', darkMode.toString());
	}, [darkMode]);

	return [darkMode, setDarkMode];
};

export default useDarkMode;
