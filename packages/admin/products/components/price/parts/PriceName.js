import { ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ price, updatePrice }) => {
	return (
		<ScInput
			value={price?.name}
			label={__('Name', 'surecart')}
			placeholder={__('Monthly, Basic Plan, etc.', 'surecart')}
			onScInput={(e) => {
				updatePrice({ name: e.target.value });
			}}
			autoFocus
		/>
	);
};
