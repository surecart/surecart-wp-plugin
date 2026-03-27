/**
 * WordPress dependencies.
 */

export default [
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Subtotal',
			},
		},
		save({ attributes }) {
			const { text, className } = attributes;
			return (
				<sc-line-item-total class="sc-subtotal" total="subtotal">
					<span slot="description">{text}</span>
				</sc-line-item-total>
			);
		},
	},
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Subtotal',
			},
		},
		save({ attributes }) {
			const { text, className } = attributes;
			return (
				<sc-line-item-total class={className} total="subtotal">
					<span slot="description">{text}</span>
				</sc-line-item-total>
			);
		},
	},
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Subtotal',
			},
			total_payments_text: {
				type: 'string',
				default: 'Total Installment Payments',
			},
			first_payment_subtotal_text: {
				type: 'string',
				default: 'Initial Payment',
			},
		},
		save({ attributes }) {
			const {
				text,
				total_payments_text,
				first_payment_subtotal_text,
				className,
			} = attributes;
			return (
				<sc-line-item-total class={className} total="subtotal">
					<span slot="description">
						{text || __('Subtotal', 'surecart')}
					</span>
					<span slot="total-payments-description">
						{total_payments_text ||
							__('Total Installment Payments', 'surecart')}
					</span>
					<span slot="first-payment-subtotal-description">
						{first_payment_subtotal_text ||
							__('Initial Payment', 'surecart')}
					</span>
				</sc-line-item-total>
			);
		},
	},
];
