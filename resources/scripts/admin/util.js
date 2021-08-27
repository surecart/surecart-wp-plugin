const { __ } = wp.i18n;

export const convertAmount = ( amount, currency ) => {
	return [ 'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw' ].includes(
		currency
	)
		? amount
		: amount / 100;
};

export const getFormattedPrice = ( { amount, currency = 'usd' } ) => {
	const converted = convertAmount( parseFloat( amount ), currency );

	return `${ new Intl.NumberFormat( undefined, {
		style: 'currency',
		currency,
	} ).format( parseFloat( converted.toFixed( 2 ) ) ) }`;
};

// get the currency symbol for a currency code.
export const getCurrencySymbol = ( code = 'usd' ) => {
	const [ currency ] = new Intl.NumberFormat( undefined, {
		style: 'currency',
		currency: code,
	} ).formatToParts();
	return currency?.value;
};

export const translate = ( key ) => {
	const map = {
		day: __( 'Day', 'checkout_engine' ),
		month: __( 'Month', 'checkout_engine' ),
		year: __( 'Year', 'checkout_engine' ),
	};
	return map?.[ key ] || key;
};
