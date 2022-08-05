import axios from 'axios';
import { useQuery } from 'react-query';

const fetchMails = (queryInfo) => {
	const token = queryInfo.queryKey[1];
	return axios.get('https://api.mail.gw/messages', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const mailListSelector = (data) => {
	return data.data['hydra:member'].map((mail) => {
		return {
			id: mail.id,
			from: { address: mail.from.address, name: mail.from.name },
			subject: mail.subject,
			intro: mail.intro,
			seen: mail.seen,
			date: mail.createdAt,
		};
	});
};

export const useMailbox = (token) => {
	return useQuery(['fetchMails', token], fetchMails, {
		enabled: !!token,
		select: mailListSelector,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};
