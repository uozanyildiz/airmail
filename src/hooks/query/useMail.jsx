import { useQuery } from 'react-query';
import axios from 'axios';

const fetchMail = (queryInfo) => {
	const { token, mailId } = queryInfo.queryKey[1];
	return axios.get(`https://api.mail.gw/messages/${mailId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

const updateMailAsSeen = (queryInfo) => {
	const { token, mailId } = queryInfo.queryKey[1];
	return axios.patch(
		`https://api.mail.gw/messages/${mailId}`,
		{
			seen: true,
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-type': 'application/merge-patch+json',
			},
		}
	);
};

const mailSelector = (data) => {
	console.log(data);
	return {
		from: data.data.from,
		subject: data.data.subject,
		date: data.data.createdAt,
		content: data.data.html,
	};
};

export const useMail = (token, mailId) => {
	useQuery(['updateAsSeen', { token, mailId }], updateMailAsSeen, {
		enabled: !!mailId,
		staleTime: Infinity,
	});
	const mailQuery = useQuery(['fetchMail', { token, mailId }], fetchMail, {
		enabled: !!mailId,
		staleTime: Infinity,
		select: mailSelector,
	});

	return mailQuery;
};
