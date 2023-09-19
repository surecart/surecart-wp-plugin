import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { product_id, currency, custom_amount, default_amount, amount_label, recurring_label,amount_columns } = attributes;

	return (
		<sc-donation-choices-new
			amountlabel={amount_label}
			recurringlabel={recurring_label}
			amountcolumns={amount_columns}
			product={product_id}
			defaultAmount={default_amount}
		>
			<InnerBlocks.Content />
		</sc-donation-choices-new>
	);
};
