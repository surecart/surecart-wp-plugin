export default ({ attributes, className }) => {
	const { label, full, show_name, default_country } = attributes;
  console.log(default_country);

	return (
		<sc-order-shipping-address
			className={className}
			label={label}
			full={full ? '1' : null}
			show-name={show_name ? '1' : null}
      default-country={default_country}
		></sc-order-shipping-address>
	);
};
