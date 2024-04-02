import { ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ price, updatePrice, className }) => {
	return (
		<ScInput
			className={className}
			type="number"
			label={__('License Activation Limit', 'surecart')}
			help={__(
				'Enter the number of unique activations per license key. Leave blank for infinite.',
				'surecart'
			)}
			value={price?.license_activation_limit}
			onScInput={(e) => {
				updatePrice({
					license_activation_limit: e.target.value || null,
				});
			}}
		/>
	);
};
