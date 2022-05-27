import { __, _n, sprintf } from '@wordpress/i18n';

export const translateInterval = (
	amount,
	interval,
	prefix = __('every', 'surecart'),
	fallback = __('once', 'surecart'),
	showSingle = false
) => {
	switch (interval) {
		case 'day':
			return `${prefix} ${sprintf(
				showSingle
					? _n('%d day', '%d days', amount, 'surecart')
					: _n('day', '%d days', amount, 'surecart'),
				amount
			)}`;
		case 'week':
			return `${prefix} ${sprintf(
				showSingle
					? _n('%d week', '%d weeks', amount, 'surecart')
					: _n('week', '%d weeks', amount, 'surecart'),
				amount
			)}`;
		case 'month':
			return `${prefix} ${sprintf(
				showSingle
					? _n('%d month', '%d months', amount, 'surecart')
					: _n('month', '%d months', amount, 'surecart'),
				amount
			)}`;
		case 'year':
			return `${prefix} ${sprintf(
				showSingle
					? _n('%d year', '%d years', amount, 'surecart')
					: _n('year', '%d years', amount, 'surecart'),
				amount
			)}`;
		default:
			return fallback;
	}
};
