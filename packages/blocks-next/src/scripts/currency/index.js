export const isZeroDecimal = (currency) => {
	return [
		'BIF',
		'BYR',
		'CLP',
		'DJF',
		'GNF',
		'ISK',
		'JPY',
		'KMF',
		'KRW',
		'PYG',
		'RWF',
		'UGX',
		'VND',
		'VUV',
		'XAF',
		'XAG',
		'XAU',
		'XBA',
		'XBB',
		'XBC',
		'XBD',
		'XDR',
		'XOF',
		'XPD',
		'XPF',
		'XPT',
		'XTS',
	].includes(currency.toUpperCase());
};

export const formatCurrency = (amount, currency = 'usd') => {
	return new Intl.NumberFormat([], {
		style: 'currency',
		currency: currency.toUpperCase(),
		currencyDisplay: 'symbol',
		minimumFractionDigits: amount % 1 == 0 ? 0 : 2,
	}).format(isZeroDecimal(currency) ? amount : amount / 100);
};

// get the currency symbol for a currency code.
export const getCurrencySymbol = (currency) => {
	const formattedParts = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency,
	}).formatToParts();
	return formattedParts.find((part) => part.type === 'currency')?.value;
};
