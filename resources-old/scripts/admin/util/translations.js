import { __, _n, sprintf } from '@wordpress/i18n';

export const translateInterval = (
	amount,
	interval,
	prefix = __( 'every', 'checkout_engine' ),
	fallback = __( 'once', 'checkout_engine' )
) => {
	switch ( interval ) {
		case 'day':
			return `${ prefix } ${ sprintf(
				_n( 'day', '%d days', amount, 'checkout_engine' ),
				amount
			) }`;
		case 'week':
			return `${ prefix } ${ sprintf(
				_n( 'week', '%d weeks', amount, 'checkout_engine' ),
				amount
			) }`;
		case 'month':
			return `${ prefix } ${ sprintf(
				_n( 'month', '%d months', amount, 'checkout_engine' ),
				amount
			) }`;
		case 'year':
			return `${ prefix } ${ sprintf(
				_n( 'year', '%d years', amount, 'checkout_engine' ),
				amount
			) }`;
		default:
			return fallback;
	}
};
