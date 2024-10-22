/**
 * External dependencies.
 */
import { dateI18n, getSettings } from '@wordpress/date';
const { formats, timezone } = getSettings();

export function formatTime(dateTime) {
	return dateI18n(formats.date, dateTime, timezone.string);
}

export function formatDate(dateTime) {
	return dateI18n(formats.date, dateTime, timezone.string);
}

export function formatDateTime(dateTime) {
	return dateI18n(`${formats.date} ${formats.time}`, dateTime, timezone.string);
}
