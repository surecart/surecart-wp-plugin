import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { product_id, amount_label, recurring_label,amount_columns, recurring_choice_label, non_recurring_choice_label } = attributes;

	return (
		<sc-donation-choices-new
			amountlabel={amount_label}
			recurringlabel={recurring_label}
			recurringchoicelabel={recurring_choice_label}
			nonrecurringchoicelabel={non_recurring_choice_label}
			amountcolumns={amount_columns}
			product={product_id}
		>
			<InnerBlocks.Content />
		</sc-donation-choices-new>
	);
};
