import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import { ReactComponent as CopyIcon } from '../assets/icons/document-copy.svg';
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg';
import { ReactComponent as SyncIcon } from '../assets/icons/sync.svg';

//eğer state yoksa, userstorage check, o da yoksa anasayfaya geri dönüş

//mailaddress, password gelince query yollarız, o zaten expiration date ile normal dateyi veriyor
//siteye girişte, userstorage var mı yok mu bakarız, eğer varsa mail sayfasına şifre + passwordla yönlendiririz, query atar
//mainpageye girişte userstorage var mı yok mu bakarız, eğer varsa mail sayfasına şifre + passwordla yönlendiririz
//eğer userstorage varsa ve expired olmuşsa, uyarı yazdırır ve userstorageyi sileriz

//mail sayfası için
//eğer expired olmuşsa uyarıyla ana sayfaya döndürürüz
//expired olmamışsa query atarız

//sync butonuna gerek olmayabilir, her 5 saniyede bir query atarız bunu da kullanıcıya gösteririz next fetch in 5 gibi
//maile tıkladığında width'i 1/3 kısarız
//maili görüntülemek için iframe çakıyoruz

const isMailExpired = (createdAt) => {
	const minutesToExpire = 10 * 1000 * 60;
	const currentTime = new Date();
	const expiringTime = new Date(createdAt.getTime() + minutesToExpire);
	return currentTime > expiringTime;
};

const Mail = ({ onClick, isUnread = false }) => {
	return (
		<div
			className={`box-border flex flex-col gap-4 bg-white py-7 px-16 relative border-l-6 ${
				isUnread ? 'border-l-primary' : 'border-l-transparent'
			}`}
		>
			<span className='text-sm text-open-grey'>from Marc Andrew</span>
			<div>
				<h3
					className='text-primary-dark font-medium text-lg inline-block transition-colors hover:text-primary cursor-pointer'
					onClick={onClick}
				>
					Work Enquiry
				</h3>
			</div>
			<p
				className={`text-sm font-medium ${
					isUnread ? 'text-black' : 'text-subtext'
				}`}
			>
				Hi Kira! We’re very excited to work with you in our recent Freelance
				Project. We have some brief..
			</p>
			<span className='absolute text-xs top-5 right-5 text-dark-grey'>
				just now
			</span>
		</div>
	);
};

const createAccount = (queryInfo) => {
	const userInfo = queryInfo.queryKey[1];
	return axios.post('https://api.mail.gw/accounts', {
		address: userInfo.mailAddress,
		password: userInfo.password,
	});
};

const getAuthorizationToken = async (queryInfo) => {
	const userInfo = queryInfo.queryKey[1];
	const req = await axios.post('https://api.mail.gw/token', {
		address: userInfo.mailAddress,
		password: userInfo.password,
	});
	return req.data.token;
};

const MailScreen = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [token, setToken] = useState('');
	const { state } = useLocation();
	const { mailAddress, password } = state; // Read values passed on state
	const onOpen = () => {
		setIsOpen(!isOpen);
	};

	const onCopy = () => {
		navigator.clipboard.writeText(mailAddress);
	};

	const onAuthorizationTokenSuccess = (data) => {
		setToken(data);
	};

	const createAccountError = (data) => {
		const errorTitle = data.response.data['hydra:title'];
		const errorDescription = data.response.data['hydra:description'];
		console.error(errorTitle, errorDescription);
	};

	const { data: account } = useQuery(
		['createAccount', { mailAddress, password }],
		createAccount,
		{
			onError: createAccountError,
			cacheTime: 10 * 1000 * 60,
			staleTime: 10 * 1000 * 60,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		}
	);

	useEffect(() => {
		console.log(token);
	}, [token]);

	const { data: authorizationToken, isLoading } = useQuery(
		['getAuthorizationToken', { mailAddress, password }],
		getAuthorizationToken,
		{
			enabled: !!account,
			onSuccess: onAuthorizationTokenSuccess,
			cacheTime: 10 * 1000 * 60,
			staleTime: 10 * 1000 * 60,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		}
	);

	return (
		<div>
			{isLoading && <p>Loading...</p>}
			{/* Header */}
			<header className='my-8 mx-28 flex items-center justify-between'>
				<div className='flex flex-col items-start gap-4'>
					<a href='/' className='group font-medium text-40'>
						airmail
						<p className='inline-block text-primary transition-all group-hover:scale-125 group-hover:-translate-y-1'>
							.
						</p>
					</a>
					<div className='items-center'>
						<UserIcon className='inline align-middle' />
						<span className='ml-4 align-middle'>{mailAddress}</span>
						<CopyIcon
							className='ml-2 cursor-pointer inline align-middle'
							onClick={onCopy}
						/>
					</div>
				</div>
				{/* Logout button */}
				<button className='group px-6 py-3 border border-primary shadow-generic rounded-lg transition-all  hover:scale-110'>
					<LogoutIcon className='inline' />
					<span className='text-sm font-medium ml-3'>Logout</span>
				</button>
			</header>
			{/* Mails */}
			<main className='ml-24 mr-32'>
				{/* Break */}
				<div className='h-px w-full bg-dark-grey60 mb-8' />
				<div className='flex '>
					{/* Mail list */}
					<div
						className={`flex flex-col first-letter:flex-nowrap  divide-y transition-all duration-1000 ease-in-out ${
							isOpen ? 'w-2/6' : 'w-full'
						}`}
					>
						<Mail onClick={onOpen} isUnread={true} />
						<Mail onClick={onOpen} isUnread={true} />
						<Mail onClick={onOpen} />
						<Mail onClick={onOpen} />
					</div>
					{/* Mailbox */}
					<div
						className={`transition-all duration-1000 ease-in-out border-l px-12 py-12 bg-white max-h-max border-l-dark-grey60 w-4/6 opacity-100 ${
							!isOpen && 'hide'
						}`}
					>
						<div className={`transition-all duration-700 pb-12 w-full h-full `}>
							<div className='flex justify-between'>
								<h2 className='text-4xl font-medium text-primary'>
									Work Enquiry
								</h2>
								<div className='text-sm text-light-grey text-right'>
									<span className='block'>two week ago</span>
									<span className='block'>16th September 2021, 11:36</span>
								</div>
							</div>
							<span className='text-open-grey text-sm inline-block mt-2'>
								from:{' '}
								<span className='font-medium inline-block'>Marc Andrew</span>{' '}
								(marcandrew@gmail.com)
							</span>
							<div className='mt-8 pb-8 h-full'>
								<iframe
									className='w-full h-full'
									title='test'
									src='test.html'
								></iframe>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default MailScreen;
