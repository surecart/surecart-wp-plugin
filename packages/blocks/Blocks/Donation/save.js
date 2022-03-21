import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { price_id, label, currency, custom_amount, default_amount } =
		attributes;
	return (
		<ce-donation-choices
			price-id={price_id}
			default-amount={default_amount}
			label={label}
			currency={currency}
		>
			<InnerBlocks.Content />
			{custom_amount && (
				<ce-choice show-control="false" size="small" value="ad_hoc">
					{__('Other', 'checkout_engine')}
				</ce-choice>
			)}
		</ce-donation-choices>
	);
};
