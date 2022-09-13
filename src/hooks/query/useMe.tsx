import { QueryFunctionContext, QueryKey, useQuery } from 'react-query';
import axios from 'axios';

interface IMeQuery {
	token?: string;
}
interface IMeResponse {
	'@context': string;
	'@id': string;
	'@type': string;
	id: string;
	address: string;
	quota: number;
	used: number;
	isDisabled: boolean;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	retentionAt: string;
}
interface IMeError {
	code: number;
	message: string;
}
const loginToMail = async (
	queryInfo: QueryFunctionContext<[QueryKey, IMeQuery['token']]>
) => {
	const token = queryInfo.queryKey[1];
	const response = await axios.get<IMeResponse>('https://api.mail.gw/me', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export const useMe = (token: IMeQuery['token']) => {
	const infoQuery = useQuery<
		IMeResponse,
		IMeError,
		string,
		[QueryKey, IMeQuery['token']]
	>(['getToken', token], loginToMail, {
		//Update every minute
		refetchInterval: 1 * 60 * 1000,
		select: (data) => data.address,
	});

	return infoQuery;
};
