import useCartStyles from '../../hooks/useCartStyles';

export default ({ attributes }) => {
	const { text, className } = attributes;
	const style = useCartStyles({ attributes });
	return (
		<div style={style} className={className}>
			<sc-cart-header>
				<span>{text}</span>
			</sc-cart-header>
		</div>
	);
};
