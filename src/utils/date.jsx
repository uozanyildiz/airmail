import { DateTime } from 'luxon';

export const isMailExpired = (createdAt) => {
	const minutesToExpire = 10 * 1000 * 60;
	const currentTime = new Date();
	const expiringTime = new Date(createdAt.getTime() + minutesToExpire);
	return currentTime > expiringTime;
};

export const getExpirationDate = (createdAt) =>
	new Date(createdAt.getTime() + 10 * 1000 * 60);

export const getRelativeDate = (date) => DateTime.fromISO(date).toRelative();
export const getLocalizedDate = (date) =>
	DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
