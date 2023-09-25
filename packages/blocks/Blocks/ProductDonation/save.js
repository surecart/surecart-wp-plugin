import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { product_id, amount_label, recurring_label,amount_columns, recurring_choice_label, non_recurring_choice_label } = attributes;

	return (
		<sc-product-donation-choices
			amount-label={amount_label}
			recurring-label={recurring_label}
			recurring-choice-label={recurring_choice_label}
			non-recurring-choice-label={non_recurring_choice_label}
			amount-columns={amount_columns}
			product={product_id}
		>
			<InnerBlocks.Content />
		</sc-product-donation-choices>
	);
};
