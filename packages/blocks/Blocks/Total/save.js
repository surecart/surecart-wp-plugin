/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const {
		text,
		subscription_text,
		free_trial_text,
		first_payment_total_text,
		due_amount_text,
		className,
	} = attributes;
	return (
		<sc-line-item-total
			class={className}
			total="total"
			size="large"
			show-currency="1"
		>
			<span slot="title">{text || __('Total', 'surecart')}</span>
			<span slot="subscription-title">
				{subscription_text || text || __('Total Due Today', 'surecart')}
			</span>
			<span slot="first-payment-total-description">
				{first_payment_total_text ||
					__('Subtotal', 'surecart')}
			</span>
			<span slot="free-trial-description">
				{free_trial_text || __('Free Trial', 'surecart')}
			</span>
			<span slot="due-amount-description">
				{due_amount_text || __('Amount Due', 'surecart')}
			</span>
		</sc-line-item-total>
	);
};
