import React, { useContext, useEffect, useState } from 'react';
import { IoMailOutline } from 'react-icons/io5';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiRefreshCw } from 'react-icons/fi';
import { FaSadTear } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { Turnstile } from '@marsidev/react-turnstile';
import { IDomainResponse, useDomain } from '../../hooks/query/useDomain';
import { useRegister } from '../../hooks/query/useRegister';
import { UserContext } from '../../context/userContext';
import { useAuth } from '../../hooks/query/useAuth';
import { generateRandomString, generateAddress } from '../../utils/mail';
const password = generateRandomString();

const MainScreen: React.FC = () => {
	const [domain, setDomain] = useState('');
	const [mailAddress, setMailAddress] = useState('');
	const [turnstileStatus, setTurnstileStatus] = useState(false);
	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	const registerQuery = useRegister(mailAddress, password);

	const onSuccess = (availableDomains: IDomainResponse) => {
		const firstAvailableDomain = availableDomains['hydra:member'].filter(
			(domain) => domain.isActive === true
		)[0].domain;
		const randomAddress = generateRandomString();
		setDomain(firstAvailableDomain);
		setMailAddress(generateAddress(randomAddress, firstAvailableDomain));
	};

	const domainQuery = useDomain(onSuccess);
	const loginQuery = useAuth(mailAddress, password);

	useEffect(() => {
		if (!userContext.user) return;
		navigate('/mail');
	}, [navigate, userContext.user]);

	const onStart = () => {
		registerQuery.refetch();
		loginQuery.refetch();
	};

	const onGenerate = () => {
		const newMailAddress = generateRandomString();
		setMailAddress(generateAddress(newMailAddress, domain));
	};

	return (
		<div className='dark:bg-grey-night bg-white'>
			<header className='text-center pt-16'>
				<a href='/' className='group dark:text-gray-200 font-medium text-10 '>
					airmail
					<p className='inline-block text-primary dark:text-primary-night transition-all group-hover:scale-125 group-hover:-translate-y-1'>
						.
					</p>
				</a>
			</header>
			<main className='flex items-center justify-center mt-16'>
				<div className='flex flex-col items-center justify-center'>
					{/* Error state */}
					{(domainQuery.isError || registerQuery.isError) && (
						<div className='flex flex-col items-center relative'>
							<FaSadTear className='text-8xl text-primary dark:text-primary-night' />
							<p className='text-subtext text-2xl mt-12'>
								Oops! Something went wrong while loading page. Maybe try again
								in 1-2 minutes.
							</p>
							<p className='text-subtext text-base mt-2'>
								{domainQuery.isError
									? domainQuery.error?.message
									: registerQuery.error?.message}
							</p>
						</div>
					)}
					{/* Loading state */}
					{(domainQuery.isLoading ||
						registerQuery.isLoading ||
						loginQuery.isLoading) && (
						<div className='relative'>
							<div className='rounded-full border-4 w-12 h-12 absolute'></div>
							<AiOutlineLoading className='text-5xl text-primary dark:text-primary-night animate-spin' />
						</div>
					)}
					{/* Get started */}
					{!domainQuery.isLoading &&
						!domainQuery.isError &&
						!registerQuery.isLoading &&
						!registerQuery.isError &&
						!loginQuery.isLoading &&
						domain && (
							<>
								<div className='flex items-center justify-between bg-white dark:bg-gray-200 rounded-lg sm:rounded-3xl shadow-generic '>
									<div className='flex gap-2 sm:gap-4 ml-2 sm:ml-4 items-center grow'>
										<IoMailOutline className='text-dark-grey w-4 h-4 sm:w-6 sm:h-6 shrink-0' />
										<span className='text-sm sm:text-base'>{mailAddress}</span>
									</div>
									<div
										onClick={onGenerate}
										className='group bg-primary dark:bg-primary-night ml-5 p-3 sm:p-5 rounded-lg sm:rounded-2xl rounded-l-none sm:rounded-l-none cursor-pointer hover:bg-primary-dark transition-colors duration-300 select-none'
									>
										<FiRefreshCw className='text-white w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ease-in-out group-hover:rotate-180 group-active:scale-125 ' />
									</div>
								</div>
								{/* Start with this e-mail */}

								{turnstileStatus && (
									<button
										onClick={onStart}
										className='mt-8 sm:mt-12 px-6 sm:px-8 py-3 sm:py-4 shadow-generic dark:shadow-transparent bg-primary dark:bg-primary-night font-semibold text-sm dark:text-gray-200 text-white rounded-lg hover:bg-primary-dark transition-colors duration-300'
									>
										Start with this e-mail
									</button>
								)}
								{!turnstileStatus && (
									<div className='mt-8 sm:mt-12 px-6 sm:px-8 py-3 sm:py-4'>
										<Turnstile
											siteKey='0x4AAAAAAAV9QbhgGyW5QMY6'
											onSuccess={() => setTurnstileStatus(true)}
											onExpire={() => setTurnstileStatus(false)}
											onError={() => setTurnstileStatus(false)}
										/>
									</div>
								)}
							</>
						)}

					{/* Break */}
					<div className='mt-16 w-screen bg-primary-dark dark:bg-primary-night opacity-60 h-px ' />
					{/* About us */}
					<div className='flex flex-col-reverse items-center xl:flex-row self-start w-full justify-center '>
						<div className='flex flex-col gap-12 sm:gap-20 px-12 py-8 sm:px-16 sm:py-12 md:px-24 md:py-16'>
							<div className='max-w-xl'>
								<div className='flex flex-col items-start sm:w-1/2'>
									<h3 className='font-medium text-2xl sm:text-3xl dark:text-gray-200'>
										What is <span className='text-primary'>airmail</span>?
									</h3>
									<img
										className='self-start'
										src='/assets/img/scrabble-1.png'
										alt=''
									/>
								</div>
								<p className='text-subtext mt-6 sm:mt-8 text-sm sm:text-base'>
									Airmail is a free service that allows getting instant
									temporary email. It is used to prevent spam into your personal
									email address. Also you can use it without registering!
								</p>
							</div>
							<div className='max-w-xl'>
								<div className='flex flex-col items-start'>
									<h3 className='font-medium text-xl sm:text-3xl dark:text-gray-200'>
										Can I recover my{' '}
										<span className='text-primary'> previous e-mails?</span>
									</h3>
									<img
										className='self-end'
										src='/assets/img/scrabble-2.png'
										alt=''
									/>
								</div>{' '}
								<p className='text-subtext mt-6 sm:mt-8 text-sm sm:text-base'>
									No, unfortunately your e-mail address only remains available
									for 10 minutes.
								</p>
								<p className='text-subtext text-sm sm:text-base mt-2'>
									For any further questions, you can reach out to me from{' '}
									<a
										className='text-primary font-semibold'
										href='mailto:uozanyildiz@gmail.com'
									>
										{' '}
										my e-mail
									</a>
									.
								</p>
							</div>
						</div>
						<div className='px-12'>
							<img className='' src='assets/img/envelope.png' alt='Airmail' />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default MainScreen;
