import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { price_id, label, custom_amount, default_amount } = attributes;
	return (
		<sc-donation-choices
			price-id={price_id}
			default-amount={default_amount}
			label={label}
		>
			<InnerBlocks.Content />
			{custom_amount && (
				<sc-choice show-control="false" size="small" value="ad_hoc">
					{__('Other', 'surecart')}
				</sc-choice>
			)}
		</sc-donation-choices>
	);
};
