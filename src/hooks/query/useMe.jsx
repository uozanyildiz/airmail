import { useQuery } from 'react-query';
import axios from 'axios';

const loginToMail = (queryInfo) => {
	const args = queryInfo.queryKey[1];
	return axios.get('https://api.mail.gw/me', {
		headers: {
			Authorization: `Bearer ${args.token}`,
		},
	});
};

export const useMe = (token) => {
	const infoQuery = useQuery(['getToken', { token }], loginToMail, {
		//Update every minute
		refetchInterval: 1 * 60 * 1000,
		select: (data) => data.data.address,
	});

	return infoQuery;
};
