const { __ } = wp.i18n;

export const convertAmount = ( amount, currency ) => {
	return [ 'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw' ].includes(
		currency
	)
		? amount
		: amount / 100;
};

export const maybeConvertAmount = ( amount, currency ) => {
	return [ 'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW' ].includes(
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

export const formatNumber = ( value, currency = '' ) =>
	new Intl.NumberFormat( [], {
		style: 'currency',
		currency: currency.toUpperCase(),
		currencyDisplay: 'symbol',
	} ).format( maybeConvertAmount( value, currency.toUpperCase() ) );

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
		archived: __( 'Archived', 'checkout_engine' ),
		draft: __( 'Draft', 'checkout_engine' ),
		active: __( 'Active', 'checkout_engine' ),
	};
	return map?.[ key ] || key;
};

export const filterObject = ( obj, predicate ) =>
	Object.keys( obj )
		.filter( ( key ) => predicate( obj[ key ] ) )
		.reduce( ( res, key ) => ( ( res[ key ] = obj[ key ] ), res ), {} );
