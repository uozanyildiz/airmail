import axios from 'axios';
import { useQuery } from 'react-query';

const createAccount = (queryInfo) => {
	const userInfo = queryInfo.queryKey[1];
	return axios.post('https://api.mail.gw/accounts', {
		address: userInfo.mail,
		password: userInfo.password,
	});
};

export const useRegister = (mail, password) => {
	const register = useQuery(
		['createAccount', { mail, password }],
		createAccount,
		{
			enabled: false,
			cacheTime: 10 * 1000 * 60,
			staleTime: 10 * 1000 * 60,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			retry: 1,
		}
	);
	return register;
};
