import { __ } from '@wordpress/i18n';

export const translations = {
	products: __('Product(s)', 'surecart'),
	total: __('Total', 'surecart'),
	coupons: __('Coupon(s)', 'surecart'),
	processors: __('Processor', 'surecart'),
	billing_country: __('Billing Country', 'surecart'),
	shipping_country: __('Shipping Country', 'surecart'),
	any: __('matches any of', 'surecart'),
	all: __('matches all of', 'surecart'),
	none: __('matches none of', 'surecart'),
	exist: __('exists', 'surecart'),
	no_exist: __('does not exist', 'surecart'),
	'==': __('is equal to', 'surecart'),
	'!=': __('is equal to', 'surecart'),
	'>': __('is greater than', 'surecart'),
	'<': __('is less than', 'surecart'),
	'>=': __('is greater or equal to', 'surecart'),
	'<=': __('is less than or equal to', 'surecart'),
};

export const createOptions = (keys) => {
	return keys.map((key) => {
		if (!translations?.[key]) return;
		return { label: translations?.[key], value: key };
	});
};

export default translations;
