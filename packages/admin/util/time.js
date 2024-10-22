/**
 * External dependencies.
 */
import { dateI18n, getSettings } from '@wordpress/date';

export function formatTime(
	s,
	options = {
		timeStyle: 'medium',
		dateStyle: 'full',
	},
	locale = []
) {
	const dtFormat = new Intl.DateTimeFormat(locale, options);
	return dtFormat.format(new Date(s * 1000));
}

export function formatDate(dateTime) {
	const { formats, timezone } = getSettings();

	return dateI18n(formats.date, dateTime, timezone.string);
}

export function formatDateTime(dateTime) {
	const { formats, timezone } = getSettings();

	return dateI18n(`${formats.date} ${formats.time}`, dateTime, timezone.string);
}
