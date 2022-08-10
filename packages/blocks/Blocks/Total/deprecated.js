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
];
