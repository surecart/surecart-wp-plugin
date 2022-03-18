import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { price_id, label, currency } = attributes;
	return (
		<ce-donation-choices
			price-id={price_id}
			label={label}
			currency={currency}
		>
			<InnerBlocks.Content />
			<ce-choice show-control="false" size="small" value="ad_hoc">
				{__('Other', 'checkout_engine')}
			</ce-choice>
		</ce-donation-choices>
	);
};
