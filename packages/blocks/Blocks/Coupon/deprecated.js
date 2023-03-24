import { __ } from '@wordpress/i18n';

export default [
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Add Coupon Code',
			},
			button_text: {
				type: 'string',
				default: 'Apply Coupon',
			},
			disabled: {
				type: 'boolean',
			},
		},
		supports: {
			className: false,
		},
		migrate(attributes) {
			const { button_text } = attributes;
			return {
				collapsed: true,
				placeholder: __('Enter coupon code', 'surecart'),
				button_text: button_text
					? button_text
					: __('Apply', 'surecart'),
				...attributes,
			};
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
