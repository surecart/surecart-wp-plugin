export default ({ attributes }) => {
	const { text, button_text, disabled } = attributes;
	if (disabled) {
		return null;
	}
	return (
		<sc-order-coupon-form label={text || null}>
			{button_text}
		</sc-order-coupon-form>
	);
};
