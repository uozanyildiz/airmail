import axios from 'axios';
import { QueryFunctionContext, useQuery } from 'react-query';

interface IRegisterQuery {
	mail: string;
	password: string;
}

interface IRegisterResponse {
	'@context': string;
	'@id': string;
	'@type': string;
	id: string;
	address: string;
	quota: number;
	used: number;
	isDisabled: boolean;
	isDeleted: boolean;
	createdAt: boolean;
	updatedAt: boolean;
	retentionAt: boolean;
}

const createAccount = async (queryInfo): Promise<IRegisterResponse> => {
	const userInfo = queryInfo.queryKey[1];
	const response = await axios.post<IRegisterResponse>(
		'https://api.mail.gw/accounts',
		{
			address: userInfo.mail,
			password: userInfo.password,
		}
	);
	return response.data;
};

export const useRegister = (
	mail: IRegisterQuery['mail'],
	password: IRegisterQuery['password']
) => {
	const register = useQuery<IRegisterResponse, Error>(
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
