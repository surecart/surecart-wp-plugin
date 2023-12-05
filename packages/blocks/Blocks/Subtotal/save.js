/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const {
		text,
		total_payments_text,
		first_payment_subtotal_text,
		className,
	} = attributes;
	return (
		<sc-line-item-total class={className} total="subtotal">
			<span slot="description">{text || __('Subtotal', 'surecart')}</span>
			<span slot="total-payments-description">
				{total_payments_text || __('Total Installment Payments', 'surecart')}
			</span>
			<span slot="first-payment-subtotal-description">
				{first_payment_subtotal_text ||
					__('First Payment Subtotal', 'surecart')}
			</span>
		</sc-line-item-total>
	);
};
