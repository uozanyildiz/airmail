import Cookies from 'universal-cookie';

const cookieName = 'auth-token';
const cookies = new Cookies();

export const setToken = (token, expireDate) => {
	cookies.set(cookieName, token, {
		path: '/',
		expires: expireDate,
	});
};

export const removeToken = () => {
	cookies.remove(cookieName);
};

export const getToken = () => {
	return cookies.get(cookieName);
};
