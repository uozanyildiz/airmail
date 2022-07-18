import React, { useEffect, useState } from 'react';
import { IoMailOutline } from 'react-icons/io5';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiRefreshCw } from 'react-icons/fi';
import { FaSadTear } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useDomain } from '../hooks/query/useDomain';

const generateRandomString = () => {
	const length = 16;
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * characters.length)];
	}
	return result;
};

const generateAddress = (mail, domain) => `${mail}@${domain}`;

const MainScreen = () => {
	const [domain, setDomain] = useState('');
	const [mailAddress, setMailAddress] = useState('');
	const navigate = useNavigate();

	const onSuccess = (availableDomains) => {
		const firstAvailableDomain = availableDomains.filter(
			(domain) => domain.isActive === true
		)[0].domain;
		const randomAddress = generateRandomString();
		setDomain(firstAvailableDomain);
		setMailAddress(generateAddress(randomAddress, firstAvailableDomain));
	};

	const { isLoading, isError, error } = useDomain(onSuccess);

	const onGenerate = () => {
		const newMailAddress = generateRandomString();
		setMailAddress(generateAddress(newMailAddress, domain));
	};

	const onStart = () => {
		navigate('mail', {
			state: { mailAddress: mailAddress, password: generateRandomString() },
		});
	};

	return (
		<>
			<header className='text-center font-medium text-40 mt-16'>
				<a href='/' className='group'>
					airmail
					<p className='inline-block text-primary transition-all group-hover:scale-125 group-hover:-translate-y-1'>
						.
					</p>
				</a>
			</header>
			<main className='flex items-center justify-center mt-16'>
				<div className='flex flex-col items-center justify-center'>
					{/* Loading state */}
					{isError && (
						<div className='flex flex-col items-center relative'>
							<FaSadTear className='text-8xl text-primary' />
							<p className='text-subtext text-2xl mt-12'>
								Oops! Something went wrong while loading page. Maybe try again
								in 1-2 minutes.
							</p>
							<p className='text-subtext text-base mt-2'>{error.message}</p>
						</div>
					)}
					{isLoading && (
						<div className='relative'>
							<div className='rounded-full border-4 w-12 h-12 absolute'></div>
							<AiOutlineLoading className='text-5xl text-primary animate-spin' />
						</div>
					)}
					{/* Get started */}
					{!isLoading && !isError && domain && (
						<>
							<div className='flex items-center justify-between bg-white rounded-2xl shadow-generic '>
								<div className='flex gap-4 py-5 pl-4 w-96'>
									<IoMailOutline className='text-dark-grey w-6 h-6' />
									<span>{mailAddress}</span>
								</div>
								<div
									onClick={onGenerate}
									className='group bg-primary px-5 py-5 rounded-2xl rounded-l-none cursor-pointer hover:bg-primary-dark transition-colors duration-300'
								>
									<FiRefreshCw className='text-white w-6 h-6 transition-transform duration-300 ease-in-out group-hover:rotate-180 group-active:scale-125 ' />
								</div>
							</div>
							{/* Start with this e-mail */}
							<button
								onClick={onStart}
								className=' mt-12 px-8 py-4 shadow-generic bg-primary font-semibold text-sm text-white rounded-lg hover:bg-primary-dark transition-colors duration-300'
							>
								Start with this e-mail
							</button>
						</>
					)}
					{/* Break */}
					<div className='mt-16 w-screen bg-dark-grey opacity-60 h-px' />
					{/* About us */}
					<div className='flex flex-col gap-20 px-24 py-16 self-start'>
						<div className='max-w-xl'>
							<div className='flex flex-col items-start w-1/2'>
								<h3 className='font-medium text-3xl'>
									What is <span className='text-primary'>airmail</span>?
								</h3>
								<img
									className='self-end'
									src='/assets/img/scrabble-1.png'
									alt=''
								/>
							</div>
							<p className='text-subtext mt-10'>
								Airmail is a free service that allows getting instant temporary
								email. It is used to prevent spam into your personal email
								address. Also you can use it without registering!
							</p>
						</div>
						<div className='max-w-xl'>
							<div className='flex flex-col items-start'>
								<h3 className='font-medium text-3xl'>
									Can I recover my{' '}
									<span className='text-primary'> previous e-mails?</span>
								</h3>
								<img
									className='self-end'
									src='/assets/img/scrabble-2.png'
									alt=''
								/>
							</div>{' '}
							{/* <div className='flex flex-col items-start relative'>
								<h3 className='font-medium text-3xl'>
									Can I recover my{' '}
									<span className='text-primary'> previous e-mails?</span>
								</h3>
								<img
									className='absolute -bottom-4 left-72'
									src='/assets/img/scrabble-2.png'
									alt=''
								/>
							</div> */}
							<p className='text-subtext mt-10'>
								No, unfortunately your e-mail address only remains available for
								10 minutes.
							</p>
							<p className='text-subtext'>
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
				</div>
			</main>
		</>
	);
};

export default MainScreen;
