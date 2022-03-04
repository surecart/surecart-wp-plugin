export default ({ attributes }) => {
	const { text, button_text, disabled } = attributes;
	if (disabled) {
		return null;
	}
	return (
		<ce-order-coupon-form label={text}>{button_text}</ce-order-coupon-form>
	);
};
