import axios from 'axios';
import { QueryFunctionContext, QueryKey, useQuery } from 'react-query';

interface IMailboxQuery {
	token?: string;
}

interface IMailItem {
	id: string;
	from: { address: string; name: string };
	subject: string;
	intro: string;
	seen: boolean;
	date: string;
}

interface IMailboxResponse {
	'@context': string;
	'@id': string;
	'@type': string;
	'hydra:member': [
		{
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
			subject: string;
			intro: string;
			seen: boolean;
			isDeleted: boolean;
			hasAttachments: boolean;
			size: number;
			downloadUrl: string;
			createdAt: string;
			updatedAt: string;
		}
	];
	'hydra:totalItems': string;
}

interface IMailboxError {
	code: number;
	message: string;
}

const fetchMails = async (
	queryInfo: QueryFunctionContext<[QueryKey, IMailboxQuery['token']]>
) => {
	const token = queryInfo.queryKey[1];
	const response = await axios.get<IMailboxResponse>(
		'https://api.mail.gw/messages',
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return response.data;
};

const mailListSelector = (data: IMailboxResponse) => {
	return data['hydra:member'].map((mail) => {
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

export const useMailbox = (token: IMailboxQuery['token']) => {
	return useQuery<
		IMailboxResponse,
		IMailboxError,
		IMailItem[],
		[QueryKey, IMailboxQuery['token']]
	>(['fetchMails', token], fetchMails, {
		enabled: !!token,
		select: mailListSelector,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};
