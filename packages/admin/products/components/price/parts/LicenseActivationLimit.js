import { ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ price, updatePrice, className, product }) => {
	if (!product?.license_activation_limit) {
		return null;
	}
	return (
		<ScInput
			className={className}
			type="number"
			label={__('License Activation Limit', 'surecart')}
			help={__(
				'Enter the number of unique activations per license key.',
				'surecart'
			)}
			placeholder={product?.license_activation_limit}
			value={price?.license_activation_limit}
			onScInput={(e) => {
				updatePrice({
					license_activation_limit: e.target.value || null,
				});
			}}
		/>
	);
};
