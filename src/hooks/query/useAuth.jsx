import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { UserContext } from '../../context/userContext';

const loginToMail = (queryInfo) => {
	const userInfo = queryInfo.queryKey[1];
	return axios.post('https://api.mail.gw/token', {
		address: userInfo.mailAddress,
		password: userInfo.password,
	});
};

export const useAuth = (mailAddress, password) => {
	const userContext = useContext(UserContext);
	const loginQuery = useQuery(
		['useAuth', { mailAddress, password }],
		loginToMail,
		{
			enabled: false,
			cacheTime: 10 * 1000 * 60,
			staleTime: 10 * 1000 * 60,
			retry: 3,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			select: (data) => data.data.token,
		}
	);

	useEffect(() => {
		if (!loginQuery.data) return;
		userContext.setUser(loginQuery.data);
	}, [loginQuery.data, userContext]);

	return loginQuery;
};
