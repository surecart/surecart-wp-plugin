import { createOptions } from '../translations';
import { ScSelect } from '@surecart/components-react';

export default ({ onChange, ...props }) => {
	return (
		<ScSelect
			choices={createOptions([
				'products',
				'prices',
				'total',
				'coupons',
				'processors',
				'shipping_country',
			])}
			unselect={false}
			onScChange={(e) => onChange(e.target.value)}
			{...props}
		/>
	);
};
