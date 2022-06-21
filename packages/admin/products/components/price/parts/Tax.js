import { __ } from '@wordpress/i18n';
import { ScSwitch } from '@surecart/components-react';

export default ({ price, updatePrice, product }) => {
	if (!product?.tax_enabled || !scData?.tax_protocol?.tax_enabled)
		return null;

	return (
		<ScSwitch
			checked={price?.tax_behavior === 'inclusive'}
			onScChange={() =>
				updatePrice({
					tax_behavior:
						price?.tax_behavior === 'inclusive'
							? 'exclusive'
							: 'inclusive',
				})
			}
		>
			{__('Tax is included', 'surecart')}
		</ScSwitch>
	);
};
