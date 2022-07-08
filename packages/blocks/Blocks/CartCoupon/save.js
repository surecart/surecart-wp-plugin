import useCartStyles from '../../hooks/useCartStyles';

export default ({ attributes }) => {
	const { text, button_text, className } = attributes;
	const style = useCartStyles({ attributes });
	return (
		<sc-order-coupon-form style={style} label={text} className={className}>
			{button_text}
		</sc-order-coupon-form>
	);
};
