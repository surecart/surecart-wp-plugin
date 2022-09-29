export default ({ attributes, className }) => {
	const { label, full, show_name, name_placeholder } = attributes;

	return (
		<sc-order-shipping-address
			className={className}
			label={label}
			full={full ? '1' : null}
			show-name={show_name ? '1' : null}
      name-placeholder={name_placeholder}
		></sc-order-shipping-address>
	);
};
