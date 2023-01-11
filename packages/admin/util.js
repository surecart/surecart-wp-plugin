import { __ } from '@wordpress/i18n';

export const maybeConvertAmount = (amount, currency) => {
	return ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'XAF'].includes(
		currency.toUpperCase()
	)
		? amount
		: amount / 100;
};

export const getFormattedPrice = ({ amount, currency = 'usd' }) => {
	const converted = maybeConvertAmount(parseFloat(amount), currency);

	return `${new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency,
	}).format(parseFloat(converted.toFixed(2)))}`;
};

export const formatNumber = (value, currency = '') =>
	new Intl.NumberFormat([], {
		style: 'currency',
		currency: currency.toUpperCase(),
		currencyDisplay: 'symbol',
	}).format(maybeConvertAmount(value, currency.toUpperCase()));

// get the currency symbol for a currency code.
export const getCurrencySymbol = (code = 'usd') => {
	const [currency] = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: code,
	}).formatToParts();
	return currency?.value;
};

export const translate = (key) => {
	const map = {
		day: __('Day', 'surecart'),
		month: __('Month', 'surecart'),
		year: __('Year', 'surecart'),
		never: __('Lifetime', 'surecart'),
		archived: __('Archived', 'surecart'),
		draft: __('Draft', 'surecart'),
		active: __('Active', 'surecart'),
	};
	return map?.[key] || key;
};

export const filterObject = (obj, predicate) =>
	Object.keys(obj)
		.filter((key) => predicate(obj[key]))
		.reduce((res, key) => ((res[key] = obj[key]), res), {});

export const snakeToCamel = (str) =>
	str
		.toLowerCase()
		.replace(/([-_][a-z])/g, (group) =>
			group.toUpperCase().replace('-', '').replace('_', '')
		);

export const camelName = (name) => {
	const camelName = snakeToCamel(name);
	return camelName.charAt(0).toUpperCase() + camelName.toLowerCase().slice(1);
};

export const createErrorString = (error) => {
	const additionalErrors = (error?.additional_errors || [])
		.map((error) => error?.message)
		.filter((n) => n);
	return `${error?.message || __('Something went wrong.', 'surecart')}${
		additionalErrors?.length && ` ${additionalErrors.join('. ')}`
	}`;
};
