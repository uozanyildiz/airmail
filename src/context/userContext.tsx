import React, { createContext, useState } from 'react';
import { getToken, removeToken, setToken } from '../utils/cookie';
import { getExpirationDate } from '../utils/date';

interface IUserContext {
	user?: string;
	setUser: (token: string) => void;
	removeUser: () => void;
}

interface IProps {
	children: JSX.Element;
}

const initialState: IUserContext = {
	user: '',
	setUser: () => {},
	removeUser: () => {},
};

export const UserContext = createContext(initialState);
export const UserContextProvider: React.FC<IProps> = ({ children }) => {
	const userFromCookie = getToken() || undefined;
	const [user, setUser] = useState(userFromCookie);

	const setUserToken = (token: string): void => {
		setToken(token, getExpirationDate(new Date()));
		setUser(token);
	};

	const removeUser = (): void => {
		removeToken();
		setUser(undefined);
	};

	return (
		<UserContext.Provider value={{ user, setUser: setUserToken, removeUser }}>
			{children}
		</UserContext.Provider>
	);
};
