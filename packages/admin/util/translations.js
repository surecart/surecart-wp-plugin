import { __, _n, sprintf } from '@wordpress/i18n';

export const translateInterval = (
	amount,
	interval,
	prefix = __('every', 'surecart'),
	fallback = __('once', 'surecart')
) => {
	switch (interval) {
		case 'day':
			return `${prefix} ${sprintf(
				_n('day', '%d days', amount, 'surecart'),
				amount
			)}`;
		case 'week':
			return `${prefix} ${sprintf(
				_n('week', '%d weeks', amount, 'surecart'),
				amount
			)}`;
		case 'month':
			return `${prefix} ${sprintf(
				_n('month', '%d months', amount, 'surecart'),
				amount
			)}`;
		case 'year':
			return `${prefix} ${sprintf(
				_n('year', '%d years', amount, 'surecart'),
				amount
			)}`;
		default:
			return fallback;
	}
};
