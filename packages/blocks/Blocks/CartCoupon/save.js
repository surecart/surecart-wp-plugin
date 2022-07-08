export default ({ attributes, context }) => {
	const { text, button_text } = attributes;
	const slot = context?.['surecart/slot'] || 'footer';
	return (
		<sc-order-coupon-form label={text} slot={`cart-${slot}`}>
			{button_text}
		</sc-order-coupon-form>
	);
};
