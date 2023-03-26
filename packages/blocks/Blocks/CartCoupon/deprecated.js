import { __ } from '@wordpress/i18n';
import useCartStyles from '../../hooks/useCartStyles';

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
			disabled: {
				type: 'boolean',
			},
			border: {
				type: 'boolean',
				default: true,
			},
			padding: {
				type: 'object',
				default: {
					top: '1.25em',
					left: '1.25em',
					bottom: '1.25em',
					right: '1.25em',
				},
			},
			backgroundColor: {
				type: 'string',
			},
			textColor: {
				type: 'string',
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
			const { text, button_text, className } = attributes;
			const style = useCartStyles({ attributes });
			return (
				<sc-order-coupon-form
					style={style}
					label={text}
					className={className}
				>
					{button_text}
				</sc-order-coupon-form>
			);
		},
	},
];
