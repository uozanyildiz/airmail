import { QueryFunctionContext, useQuery } from 'react-query';
import axios from 'axios';

interface IMeQuery {
	token: string;
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

const loginToMail = async (
	queryInfo: QueryFunctionContext<[string, IMeQuery]>
) => {
	const token = queryInfo.queryKey[1];
	const response = await axios.get<IMeResponse>('https://api.mail.gw/me', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export const useMe = (token: IMeQuery) => {
	const infoQuery = useQuery(['getToken', token], loginToMail, {
		//Update every minute
		refetchInterval: 1 * 60 * 1000,
		select: (data) => data.address,
	});

	return infoQuery;
};
