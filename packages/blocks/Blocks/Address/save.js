export default ({ attributes, className }) => {
	const { label, full } = attributes;
	return (
		<sc-order-shipping-address
			className={className}
			label={label}
			full={full ? '1' : null}
		></sc-order-shipping-address>
	);
};
