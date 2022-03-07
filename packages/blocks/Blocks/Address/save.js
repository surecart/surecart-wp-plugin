export default ({ attributes, className }) => {
	const { label } = attributes;
	return (
		<ce-order-shipping-address
			className={className}
			label={label}
		></ce-order-shipping-address>
	);
};
