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

export const intervalString = (price, options = {}) => {
	if (!price) {
		return '';
	}
	const { showOnce, labels } = options;
	const {
		interval = __('every', 'surecart'),
		period = __('for', 'surecart'),
	} = labels || {};
	return `${intervalCountString(
		price,
		interval,
		!!showOnce ? __('once', 'surecart') : ''
	)} ${periodCountString(price, period)}`;
};

export const intervalCountString = (
	price,
	prefix,
	fallback = __('once', 'surecart')
) => {
	if (!price.recurring_interval_count || !price.recurring_interval) {
		return '';
	}
	return translateInterval(
		price.recurring_interval_count,
		price.recurring_interval,
		` ${prefix}`,
		fallback
	);
};

export const periodCountString = (price, prefix, fallback = '') => {
	if (!price?.recurring_period_count || !price?.recurring_interval) {
		return '';
	}
	return translateInterval(
		(price?.recurring_period_count || 0) * price?.recurring_interval_count,
		price?.recurring_interval,
		` ${prefix}`,
		fallback,
		true
	);
};
