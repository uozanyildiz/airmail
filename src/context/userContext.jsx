import { createContext, useState } from 'react';
import { getToken, removeToken, setToken } from '../utils/cookie';
import { getExpirationDate } from '../utils/date';
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
	const userFromCookie = getToken() || null;
	const [user, setUser] = useState(userFromCookie);

	const setUserToken = (token) => {
		setToken(token, getExpirationDate(new Date()));
		setUser(token);
	};

	const removeUser = () => {
		removeToken();
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, setUser: setUserToken, removeUser }}>
			{children}
		</UserContext.Provider>
	);
};
