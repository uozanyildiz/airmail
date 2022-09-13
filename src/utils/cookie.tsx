import Cookies from 'universal-cookie';

const cookieName: string = 'auth-token';
const cookies = new Cookies();

export const setToken = (token: string, expireDate: Date): void => {
	cookies.set(cookieName, token, {
		path: '/',
		expires: expireDate,
	});
};

export const removeToken = (): void => {
	cookies.remove(cookieName);
};

export const getToken = (): string => {
	return cookies.get(cookieName);
};
