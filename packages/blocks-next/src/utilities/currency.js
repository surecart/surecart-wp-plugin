export const maybeConvertAmount = (amount, currency = scData?.currency) => {
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
	].includes(currency?.toUpperCase())
		? amount
		: amount / 100;
};

export const getFormattedPrice = ({
	amount,
	currency = scData?.currency || 'usd',
	options = {},
}) => {
	const converted = maybeConvertAmount(parseFloat(amount), currency);

	const minimumFractionDigits = amount % 1 == 0 ? 0 : 2;

	return `${new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency,
		minimumFractionDigits,
		...options,
	}).format(parseFloat(converted.toFixed(2)))}`;
};

export const formatNumber = (value, currency = '') =>
	new Intl.NumberFormat([], {
		style: 'currency',
		currency: currency.toUpperCase(),
		currencyDisplay: 'symbol',
	}).format(maybeConvertAmount(value, currency.toUpperCase()));
