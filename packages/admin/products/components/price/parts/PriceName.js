import { ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { forwardRef } from 'react';

const PriceName = ({ price, updatePrice }, ref) => {
	return (
		<ScInput
			value={price?.name}
			label={__('Name', 'surecart')}
			placeholder={__('Monthly, Basic Plan, etc.', 'surecart')}
			onScInput={(e) => {
				updatePrice({ name: e.target.value });
			}}
			ref={ref}
			autoFocus
		/>
	);
};
export default forwardRef(PriceName);
