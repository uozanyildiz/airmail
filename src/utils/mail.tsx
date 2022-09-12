export const generateRandomString = (): string => {
	const length = 16;
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * characters.length)];
	}
	return result;
};

export const generateAddress = (mail: string, domain: string): string =>
	`${mail}@${domain}`;
