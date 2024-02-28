// TODO: switch to @wordpress/i18n once it's supported in modules.
const { __, _n, sprintf } = wp.i18n;

/**
 * Translate the interval.
 */
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

/**
 * Translate abbreviated interval.
 */
export const translateAbbreviatedInterval = (
	amount,
	interval,
	fallback = __('once', 'surecart'),
	showSingle = false
) => {
	switch (interval) {
		case 'day':
			return ` / ${sprintf(
				showSingle
					? _n('%d day', '%d days', amount, 'surecart')
					: _n('day', '%d days', amount, 'surecart'),
				amount
			)}`;
		case 'week':
			return ` / ${sprintf(
				showSingle
					? _n('%d wk', '%d wks', amount, 'surecart')
					: _n('wk', '%d wks', amount, 'surecart'),
				amount
			)}`;
		case 'month':
			return ` / ${sprintf(
				showSingle
					? _n('%d mo', '%d months', amount, 'surecart')
					: _n('mo', '%d mos', amount, 'surecart'),
				amount
			)}`;
		case 'year':
			return ` / ${sprintf(
				showSingle
					? _n('%d yr', '%d yrs', amount, 'surecart')
					: _n('yr', '%d yrs', amount, 'surecart'),
				amount
			)}`;
		default:
			return fallback;
	}
};

/**
 * Get the interval string.
 */
export const intervalString = (price, options = {}) => {
	if (!price) {
		return '';
	}
	const { showOnce, labels, abbreviate } = options;
	const { interval = __('every', 'surecart') } = labels || {};

	return `${intervalCountString(
		price,
		interval,
		!!showOnce ? __('once', 'surecart') : '',
		abbreviate
	)} ${periodCountString(price, abbreviate)}`;
};

/**
 * Get the interval count string.
 */
export const intervalCountString = (
	price,
	prefix,
	fallback = __('once', 'surecart'),
	abbreviate = false
) => {
	if (
		!price.recurring_interval_count ||
		!price.recurring_interval ||
		1 === price?.recurring_period_count
	) {
		return '';
	}
	if (abbreviate) {
		return translateAbbreviatedInterval(
			price.recurring_interval_count,
			price.recurring_interval,
			fallback
		);
	}
	return translateInterval(
		price.recurring_interval_count,
		price.recurring_interval,
		` ${prefix}`,
		fallback
	);
};

/**
 * Get the period count string.
 */
export const periodCountString = (price, abbreviate = false) => {
	if (!price?.recurring_period_count || 1 === price?.recurring_period_count) {
		return '';
	}
	if (abbreviate) {
		return `x ${price.recurring_period_count}`;
	}

	return ` (${sprintf(
		_n(
			'%d payment',
			'%d payments',
			price.recurring_period_count,
			'surecart'
		),
		price.recurring_period_count
	)})`;
};
