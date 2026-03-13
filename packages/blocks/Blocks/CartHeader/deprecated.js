import useCartStyles from '../../hooks/useCartStyles';

const v1 = {
	attributes: {
		text: { type: 'string', default: 'Cart' },
		border: { type: 'boolean', default: true },
		padding: {
			type: 'object',
			default: { top: '1.25em', left: '1.25em', bottom: '1.25em', right: '1.25em' },
		},
		backgroundColor: { type: 'string' },
		textColor: { type: 'string' },
	},
	save({ attributes }) {
		const { text, className } = attributes;
		const style = useCartStyles({ attributes });
		return (
			<div style={style} className={className}>
				<sc-cart-header>
					<span>{text}</span>
				</sc-cart-header>
			</div>
		);
	},
};
export default [v1];
