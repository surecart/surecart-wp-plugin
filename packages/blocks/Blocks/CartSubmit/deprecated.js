/**
 * WordPress dependencies.
 */
import useCartStyles from '../../hooks/useCartStyles';

export default [
	{
		attributes: {
			text: {
				type: 'string',
				default: 'Checkout',
			},
			show_icon: {
				type: 'boolean',
			},
			size: {
				type: 'string',
				default: 'medium',
			},
			border: {
				type: 'boolean',
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
		save({ attributes }) {
			const { text, size, show_icon, className } = attributes;
			const style = useCartStyles({ attributes });
			return (
				<sc-cart-submit
					className={className}
					style={style}
					type={'primary'}
					size={size}
					icon={show_icon ? 'lock' : false}
				>
					{text}
				</sc-cart-submit>
			);
		},
	},
];
