export default [
	{
		attributes: {
			lock: {
				remove: true,
			},
			text: {
				type: 'string',
				default: 'Add Coupon Code',
			},
			button_text: {
				type: 'string',
				default: 'Apply Coupon',
			},
			placeholder: {
				type: 'string',
				default: 'Enter coupon code',
			},
			collapsed: {
				type: 'boolean',
				default: true,
			},
			disabled: {
				type: 'boolean',
			},
		},
		save({ attributes }) {
			const { text, button_text, disabled } = attributes;
			if (disabled) {
				return null;
			}
			return (
				<sc-order-coupon-form label={text || null}>
					{button_text}
				</sc-order-coupon-form>
			);
		},
	},
];
