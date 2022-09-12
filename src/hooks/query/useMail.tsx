import { QueryFunctionContext, useQuery } from 'react-query';
import axios from 'axios';

interface IMailQuery {
	token: string;
	mailId: string;
}

interface IMailResponse {
	'@context': string;
	'@id': string;
	'@type': string;
	id: string;
	accountId: string;
	msgid: string;
	from: {
		address: string;
		name: string;
	};
	to: [
		{
			address: string;
			name: string;
		}
	];
	cc: string[];
	bcc: string[];
	subject: string;
	seen: boolean;
	flagged: boolean;
	isDeleted: boolean;
	verifications: [];
	retention: boolean;
	retentionDate: string;
	text: string;
	html: string[];
	hasAttachments: string;
	attachments: string[];
	size: number;
	downloadUrl: string;
	createdAt: string;
	updatedAt: string;
}

interface IMailSeenResponse {
	'@context': string;
	'@id': string;
	'@type': string;
	seen: boolean;
}

const fetchMail = async (
	queryInfo: QueryFunctionContext<[string, IMailQuery]>
) => {
	const { token, mailId } = queryInfo.queryKey[1];
	const response = await axios.get<IMailResponse>(
		`https://api.mail.gw/messages/${mailId}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return response.data;
};

const updateMailAsSeen = async (
	queryInfo: QueryFunctionContext<[string, IMailQuery]>
) => {
	const { token, mailId } = queryInfo.queryKey[1];
	const response = await axios.patch<IMailSeenResponse>(
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
	return response.data;
};

const mailSelector = (data: IMailResponse) => {
	return {
		from: data.from,
		subject: data.subject,
		date: data.createdAt,
		content: data.html,
	};
};

export const useMail = (
	token: IMailQuery['token'],
	mailId: IMailQuery['mailId']
) => {
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
