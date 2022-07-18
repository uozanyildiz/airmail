import { useQuery } from 'react-query/';
import axios from 'axios';

const createAccount = (queryInfo) => {
	const userInfo = queryInfo.queryKey[1];
	return axios.post('https://api.mail.gw/accounts', {
		address: userInfo.mailAddress,
		password: userInfo.password,
	});
};

const getAuthorizationToken = async (queryInfo) => {
	const userInfo = queryInfo.queryKey[1];
	const req = await axios.post('https://api.mail.gw/token', {
		address: userInfo.mailAddress,
		password: userInfo.password,
	});
	return req.data.token;
};

export const useMail = (
	mail,
	password,
	onCreateAccountError = () => {},
	onAuthorizationTokenSuccess = () => {}
) => {
	const { data: account } = useQuery(
		['createAccount', { mail, password }],
		createAccount,
		{
			onError: onCreateAccountError,
			cacheTime: 10 * 1000 * 60,
			staleTime: 10 * 1000 * 60,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		}
	);

	return useQuery(
		['getAuthorizationToken', { mail, password }],
		getAuthorizationToken,
		{
			enabled: !!account,
			onSuccess: onAuthorizationTokenSuccess,
			cacheTime: 10 * 1000 * 60,
			staleTime: 10 * 1000 * 60,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			select: (data) => data.req.data.token,
		}
	);
};
