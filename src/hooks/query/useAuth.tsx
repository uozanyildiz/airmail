import axios, { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { QueryFunctionContext, useQuery } from 'react-query';
import { UserContext } from '../../context/userContext';

interface IAuth {
	id: string;
	token: string;
}

interface IAuthQuery {
	address: string;
	password: string;
}

const loginToMail = async (
	queryInfo: QueryFunctionContext<[string, IAuthQuery]>
) => {
	const userInfo = queryInfo.queryKey[1];
	const response: AxiosResponse<IAuth> = await axios.post<IAuth>(
		'https://api.mail.gw/token',
		{
			address: userInfo.address,
			password: userInfo.password,
		}
	);
	return response.data;
};

export const useAuth = (
	address: IAuthQuery['address'],
	password: IAuthQuery['password']
) => {
	const userContext = useContext(UserContext);
	const loginQuery = useQuery(['useAuth', { address, password }], loginToMail, {
		enabled: false,
		cacheTime: 10 * 1000 * 60,
		staleTime: 10 * 1000 * 60,
		retry: 3,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		select: (data) => data.token,
	});

	useEffect(() => {
		if (!loginQuery.data) return;
		userContext.setUser(loginQuery.data);
	}, [loginQuery.data, userContext]);

	return loginQuery;
};
