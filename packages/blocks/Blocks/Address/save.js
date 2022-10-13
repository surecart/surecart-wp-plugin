export default ({ attributes, className }) => {
	const { label, full, show_name, default_country, name_placeholder, country_placeholder, city_placeholder, line_1_placeholder, postal_code_placeholder, state_placeholder } = attributes;

	return (
		<sc-order-shipping-address
			className={className}
			label={label}
			full={full ? '1' : null}
			show-name={show_name ? '1' : null}
      name-placeholder={name_placeholder}
      country-placeholder={country_placeholder}
      city-placeholder={city_placeholder}
      line-1-placeholder={line_1_placeholder}
      postal-code-placeholder={postal_code_placeholder}
      state-placeholder={state_placeholder}
      default-country={default_country}
		></sc-order-shipping-address>
	);
};
