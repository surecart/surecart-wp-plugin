import { SelectControl } from '@wordpress/components';
import { createOptions } from './translations';

export default (props) => {
	return (
		<SelectControl
			options={createOptions([
				'cart_item',
				'cart_total',
				'cart_coupons',
				'cart_payment_method',
				'cart_billing_country',
				'cart_shipping_country',
			])}
			{...props}
		/>
	);
};
