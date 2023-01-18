import { createOptions } from './translations';
import { ScSelect } from '@surecart/components-react';

export default (props) => {
	return (
    <ScSelect
			choices={createOptions([
        'cart_item',
        'cart_total',
        'cart_coupons',
        'cart_payment_method',
        'cart_billing_country',
        'cart_shipping_country',
      ])}
      unselect={false}
      {...props}
      style={{ 'margin-bottom': '15px' }}
		/>
	);
};
