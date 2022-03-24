export default ({ className, attributes }) => {
	const { label, help, price_id, placeholder, show_currency_code, required } =
		attributes;

	return (
		<sc-custom-order-price-input
			class={className || false}
			label={label || false}
			help={help || false}
			price-id={price_id}
			placeholder={placeholder}
			show-code={show_currency_code ? 'true' : 'false'}
			required={required ? 'true' : 'false'}
		></sc-custom-order-price-input>
	);
};
