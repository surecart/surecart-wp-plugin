export default ( { attributes } ) => {
	const { text, button_text } = attributes;
	return <ce-coupon-form label={ text }>{ button_text }</ce-coupon-form>;
};
