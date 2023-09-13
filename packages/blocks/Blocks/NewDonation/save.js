import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { product_id, label, currency, custom_amount, default_amount } =
		attributes;
	return (
		<sc-donation-choices-new
			label={label}
			product={product_id}
			defaultAmount={default_amount}
		>
			<InnerBlocks.Content />
		</sc-donation-choices-new>
	);
};
