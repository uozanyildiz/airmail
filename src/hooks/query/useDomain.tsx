import { QueryKey, useQuery } from 'react-query';
import axios from 'axios';

export interface IDomainResponse {
	'@context': string;
	'@id': string;
	'@type': string;
	'hydra:member': [
		{
			'@id': string;
			'@type': string;
			createdAt: string;
			domain: string;
			id: string;
			isActive: boolean;
			updatedAt: string;
		}
	];
	'hydra:totalItems': number;
}

const fetchDomain = async () => {
	const response = await axios.get<IDomainResponse>(
		'https://api.mail.gw/domains/'
	);
	return response.data;
};

export const useDomain = (onSuccess: (data: IDomainResponse) => void) => {
	return useQuery<IDomainResponse, Error, IDomainResponse, string>(
		'fetchDomain',
		fetchDomain,
		{
			//30 minutes of cache and stale time
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			onSuccess,
		}
	);
};
