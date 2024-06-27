/**
 * WordPress dependencies.
 */

export default [
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Total',
			},
			subscription_text: {
				type: 'string',
				default: 'Total Due Today',
			},
		},
		save({ attributes }) {
			const { text, subscription_text, className } = attributes;
			return (
				<sc-line-item-total
					class={`sc-line-item-total ${className}`}
					total="total"
					size="large"
					show-currency="1"
				>
					<span slot="title">{text}</span>
					<span slot="subscription-title">
						{subscription_text || text}
					</span>
				</sc-line-item-total>
			);
		},
	},
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Total',
			},
			subscription_text: {
				type: 'string',
				default: 'Total Due Today',
			},
		},
		save({ attributes }) {
			const { text, subscription_text } = attributes;
			return (
				<sc-line-item-total
					class="sc-line-item-total"
					total="total"
					size="large"
					show-currency="1"
				>
					<span slot="description">{text}</span>
					<span slot="subscription-title">
						{subscription_text || text}
					</span>
				</sc-line-item-total>
			);
		},
	},
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Total',
			},
			subscription_text: {
				type: 'string',
				default: 'Total Due Today',
			},
		},
		save({ attributes }) {
			const { text, subscription_text, className } = attributes;
			return (
				<sc-line-item-total
					class={className}
					total="total"
					size="large"
					show-currency="1"
				>
					<span slot="title">{text}</span>
					<span slot="subscription-title">
						{subscription_text || text}
					</span>
				</sc-line-item-total>
			);
		},
	},
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Total',
			},
			due_amount_text: {
				type: 'string',
				default: 'Amount Due',
			},
			subscription_text: {
				type: 'string',
				default: 'Total Due Today',
			},
			first_payment_total_text: {
				type: 'string',
				default: 'Subtotal',
			},
			free_trial_text: {
				type: 'string',
				default: 'Free Trial',
			},
		},
		save({ attributes }) {
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
						{subscription_text ||
							text ||
							__('Total Due Today', 'surecart')}
					</span>
					<span slot="first-payment-total-description">
						{first_payment_total_text || __('Subtotal', 'surecart')}
					</span>
					<span slot="free-trial-description">
						{free_trial_text || __('Free Trial', 'surecart')}
					</span>
					<span slot="due-amount-description">
						{due_amount_text || __('Amount Due', 'surecart')}
					</span>
				</sc-line-item-total>
			);
		},
	},
];
