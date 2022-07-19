import useCartStyles from '../../hooks/useCartStyles';

export default function save({ attributes }) {
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
}
