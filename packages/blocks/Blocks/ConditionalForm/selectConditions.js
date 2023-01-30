import { createOptions } from './translations';
import { ScSelect } from '@surecart/components-react';

export default (props) => {
	return (
    <ScSelect
			choices={createOptions([
        'products',
        'total',
        'coupons',
        'payment_methods',
        'billing_country',
        'shipping_country',
      ])}
      unselect={false}
      {...props}
      style={{ 'margin-bottom': '15px' }}
		/>
	);
};
