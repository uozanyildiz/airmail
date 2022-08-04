import { useQuery } from 'react-query';
import axios from 'axios';
const fetchDomain = () => {
	return axios.get('https://api.mail.gw/domains/');
};

export const useDomain = (onSuccess = () => {}, onError = () => {}) => {
	return useQuery('fetchDomain', fetchDomain, {
		//30 minutes of cache and stale time
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		onSuccess,
		onError,
		select: (data) => data.data['hydra:member'],
	});
};
