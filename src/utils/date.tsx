import { DateTime } from 'luxon';

export const isMailExpired = (createdAt: Date): boolean => {
	const minutesToExpire = 10 * 1000 * 60;
	const currentTime = new Date();
	const expiringTime = new Date(createdAt.getTime() + minutesToExpire);
	return currentTime > expiringTime;
};

export const getExpirationDate = (createdAt: Date): Date =>
	new Date(createdAt.getTime() + 10 * 1000 * 60);

export const getRelativeDate = (isoDate: string): string =>
	DateTime.fromISO(isoDate).toRelative();
export const getLocalizedDate = (isoDate: string): string =>
	DateTime.fromISO(isoDate).toLocaleString(DateTime.DATETIME_MED);
