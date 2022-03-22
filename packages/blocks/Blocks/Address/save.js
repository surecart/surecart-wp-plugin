export default ({ attributes, className }) => {
	const { label } = attributes;
	return (
		<sc-order-shipping-address
			className={className}
			label={label}
		></sc-order-shipping-address>
	);
};
