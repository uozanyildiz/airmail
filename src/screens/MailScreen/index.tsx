import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { ReactComponent as CopyIcon } from '../../assets/icons/document-copy.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import { ReactComponent as SyncIcon } from '../../assets/icons/sync.svg';

import { AiOutlineLoading } from 'react-icons/ai';
import { FaSadTear } from 'react-icons/fa';
import { MdArrowBackIos } from 'react-icons/md';
import { useMailbox } from '../../hooks/query/useMailbox';
import { useMail } from '../../hooks/query/useMail';
import { getLocalizedDate, getRelativeDate } from '../../utils/date';
import { UserContext } from '../../context/userContext';
import { useMe } from '../../hooks/query/useMe';

const MailboxItem: React.FC<IMailboxItemProps> = ({
	date,
	from,
	id,
	intro,
	onClick,
	seen: hasSeen,
	subject,
}) => {
	const [isMailOpened, setIsMailOpened] = useState(hasSeen);
	const sender =
		from.name !== '' ? `${from.name} (${from.address})` : from.address;
	const dateText = getRelativeDate(date);

	const onOpenMail = (): void => {
		onClick(id);
		setIsMailOpened(true);
	};
	return (
		<div
			className={`box-border flex flex-col gap-3 sm:gap-4 bg-white py-7 px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 relative border-l-6 transition-all ${
				!isMailOpened ? 'border-l-primary' : 'border-l-transparent'
			}`}
		>
			<span className='sm:absolute text-xs sm:top-5 sm:right-5 text-dark-grey'>
				{dateText}
			</span>
			<span className='text-sm text-open-grey w-5/6'>from {sender}</span>
			<div className='md:mt-3 sm:mt-0'>
				<h3
					className='text-primary-dark font-medium text-lg inline-block transition-colors hover:text-primary cursor-pointer'
					onClick={onOpenMail}
				>
					{subject}
				</h3>
			</div>
			<p
				className={`text-sm font-medium ${
					!isMailOpened ? 'text-black' : 'text-subtext'
				}`}
			>
				{intro}
			</p>
		</div>
	);
};

const MailContent: React.FC<IMailContentProps> = ({
	token,
	id,
	isOpen,
	onClose,
}) => {
	const mailQuery = useMail(token, id);

	//When loading data
	if (!mailQuery.data) {
		return (
			<div
				className={`transition-all duration-1000 ease-in-out border-l px-12 py-12 bg-white max-h-max border-l-dark-grey60 w-4/6 opacity-100 ${
					!isOpen && 'hide'
				}`}
			>
				<div className='transition-all duration-700 pb-12 w-full h-full'>
					<div className='mb-4 cursor-pointer inline-block' onClick={onClose}>
						<MdArrowBackIos className='inline-block align-middle' />
						<span className='align-middle'>Back</span>
					</div>
					<div className='flex justify-between'>
						<h2 className='text-4xl font-medium text-primary'>...</h2>
						<div className='text-sm text-light-grey text-right'>
							<span className='block'>...</span>
							<span className='block'>...</span>
						</div>
					</div>
					<span className='text-open-grey text-sm inline-block mt-2'>
						from: <span className='font-medium inline-block'>...</span> (...)
					</span>
					<div className='mt-8 pb-8 h-full'></div>
				</div>
			</div>
		);
	}

	const dateText = getRelativeDate(mailQuery.data.date);
	const normalDate = getLocalizedDate(mailQuery.data.date);

	return (
		<div
			className={`w-full h-screen max-h-max opacity-100 px-12 py-12 bg-white border-l border-l-dark-grey60 transition-all duration-1000 ease-in-out ${
				!isOpen ? 'hide' : ''
			}`}
		>
			<div className='transition-all duration-700 pb-12 w-full h-full'>
				<div className='mb-4 cursor-pointer inline-block' onClick={onClose}>
					<MdArrowBackIos className='inline-block align-middle' />
					<span className='align-middle'>Back</span>
				</div>
				<div className='flex flex-col justify-center xs:flex-row xs:justify-between gap-4'>
					<h2 className='sm:text-lg md:text-xl lg:text-4xl font-medium text-primary'>
						{mailQuery.data.subject}
					</h2>
					<div className='text-xs lg:text-sm text-light-grey xs:text-right flex-shrink-0'>
						<span className='block'>{dateText}</span>
						<span className='block'>{normalDate}</span>
					</div>
				</div>
				<span className='text-open-grey text-sm inline-block mt-2'>
					from: {mailQuery.data.from.address}
				</span>
				<div className='mt-8 pb-8 h-full'>
					<iframe
						className='w-full h-5/6'
						title='mail-content'
						srcDoc={mailQuery.data.content.toString()}
					></iframe>
				</div>
			</div>
		</div>
	);
};

const Header: React.FC<IHeaderProps> = ({ onSync, mail }) => {
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const onCopy = () => {
		if (!mail) return;
		navigator.clipboard.writeText(mail);
	};

	const onLogout = () => {
		userContext.removeUser();
		navigate('/');
	};

	return (
		<header className='py-8 px-6 xs:px-12 sm:px-24 flex flex-col gap-8 md:flex-row md:gap-0 items-start md:items-center justify-between dark:bg-grey-night bg-white'>
			<div className='flex flex-col items-start gap-4'>
				<a
					href='/'
					className='group font-medium text-2xl xs:text-3xl sm:text-4xl text-gray-200'
				>
					airmail
					<p className='inline-block text-primary transition-all group-hover:scale-125 group-hover:-translate-y-1'>
						.
					</p>
				</a>
				{mail && (
					<div className='items-center'>
						<UserIcon className='inline-block dark:fill-gray-400 align-middle h-4 w-4 xs:h-6 xs:w-6 sm:h-8 sm:w-8 ' />
						<span className='ml-2 xs:ml-4 align-middle text-sm sm:text-base dark:text-gray-300'>
							{mail}
						</span>
						<CopyIcon
							className='ml-2 cursor-pointer inline-block align-middle'
							onClick={onCopy}
						/>
					</div>
				)}
			</div>
			{/* Logout & sync button */}
			<div className='flex gap-6 items-end'>
				<button
					onClick={onSync}
					className='group px-4 py-2 xs:px-6 xs:py-3 border-2 dark:shadow-transparent bg-primary border-primary shadow-generic rounded-lg transition-all hover:scale-110 text-white'
				>
					<SyncIcon className='inline group-hover:rotate-180 transition-all duration-300' />
					<span className='text-sm font-medium ml-3'>Sync</span>
				</button>
				<button
					onClick={onLogout}
					className='px-4 py-2 xs:px-6 xs:py-3 border dark:text-gray-300 dark:shadow-transparent border-primary shadow-generic rounded-lg transition-all hover:scale-110'
				>
					<LogoutIcon className='inline' />
					<span className='text-sm font-medium ml-3'>Logout</span>
				</button>

				{/* TODO: Progress bar */}
				{/* <div className='relative'>
					<span className='text-subtext text-base'>
						Expiring in 9 minutes 59 seconds
					</span>
					<div
						style={{ width: `${20}%` }}
						className='absolute h-1 bg-primary rounded-sm mt-4'
					></div>
					<div className='h-1 bg-open-grey rounded-sm mt-4'></div>
				</div> */}
			</div>
		</header>
	);
};

const MailScreen: React.FC = () => {
	const navigate = useNavigate();
	const userContext = useContext(UserContext);
	const [selectedMailId, setSelectedMailId] = useState('');
	const [isContentOpen, setIsContentOpen] = useState(false);

	const onOpen = (mailId: string) => {
		setSelectedMailId(mailId);
		setIsContentOpen(true);
	};

	const onClose = () => {
		setIsContentOpen(false);
	};

	useEffect(() => {
		if (userContext.user) return;
		navigate('/');
	}, [navigate, userContext.user]);

	const meQuery = useMe(userContext.user);
	const mailQuery = useMailbox(userContext.user);

	const onSync = () => {
		mailQuery.refetch();
	};

	const isLoading =
		meQuery.isLoading ||
		mailQuery.isLoading ||
		mailQuery.isRefetching ||
		!userContext.user;

	// Loading state
	if (isLoading) {
		return (
			<div className='dark:bg-grey-night'>
				<Header mail={meQuery.data} />
				<div className='h-px w-full bg-dark-grey60 mb-8' />
				<div className='relative ml-24 mr-32 flex flex-col items-center'>
					<div className='rounded-full border-4 w-32 h-32 absolute'></div>
					<AiOutlineLoading className='text-9xl text-primary animate-spin' />
				</div>
			</div>
		);
	}

	// Error state
	if (meQuery.isError || mailQuery.isError) {
		const error = meQuery.error || mailQuery.error;
		const errorTitle = error?.message;
		return (
			<div className='dark:bg-grey-night'>
				<Header mail={meQuery.data} />
				<div className='h-px w-full bg-dark-grey60 mb-8' />
				<div className='flex flex-col items-center my-8 mx-6 xs:mx-12 sm:mx-24'>
					<FaSadTear className='text-9xl text-primary' />
					<h5 className='text-subtext text-lg sm:text-xl md:text-2xl mt-6 sm:mt-12'>
						{errorTitle}
					</h5>
				</div>
			</div>
		);
	}

	if (mailQuery.data!.length === 0) {
		return (
			<div className='dark:bg-grey-night'>
				<Header mail={meQuery.data} onSync={onSync} />
				<div className='h-px w-full bg-dark-grey60 mb-8' />
				<div className='flex flex-col items-center my-8 mx-6 xs:mx-12 sm:mx-24 text-center'>
					<h5 className='text-subtext dark:text-gray-300 text-lg sm:text-xl md:text-2xl mt-6 sm:mt-12'>
						No mail has been arrived to this e-mail address yet.
					</h5>
				</div>
			</div>
		);
	}

	return (
		<div className='dark:bg-grey-night'>
			<Header mail={meQuery.data} onSync={onSync} />
			<div className='h-px w-full bg-dark-grey60  md:mb-8' />
			{/* md:ml-24 md:mr-32 md:pb-12 */}
			<main className='md:ml-24 md:mr-32'>
				{/* Break */}
				<div className='flex relative'>
					{/* Mail list */}
					<div
						className={`flex flex-col first-letter:flex-nowrap divide-y transition-all duration-1000 ease-in-out ${
							isContentOpen ? 'hide-full w-2/6' : 'w-full'
						}`}
					>
						{mailQuery.data!.map((mail) => (
							<MailboxItem key={mail.id} onClick={onOpen} {...mail} />
						))}
					</div>
					{/* Mailbox */}
					<MailContent
						token={userContext.user!}
						id={selectedMailId}
						isOpen={isContentOpen}
						onClose={onClose}
					/>
				</div>
			</main>
		</div>
	);
};

interface IMailboxItemProps {
	date: string;
	from: { name: string; address: string };
	id: string;
	intro: string;
	onClick: (id: string) => void;
	seen: boolean;
	subject: string;
}

interface IMailContentProps {
	token: string;
	id: string;
	isOpen: boolean;
	onClose: () => void;
}

interface IHeaderProps {
	onSync?: () => void;
	mail?: string;
}

export default MailScreen;
