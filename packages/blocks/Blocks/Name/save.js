export default ({ className, attributes }) => {
	const { label, help, autofocus, placeholder, showLabel, size, required } =
		attributes;

	return (
		<sc-customer-name
			class={className || false}
			label={label || false}
			help={help || false}
			autofocus={autofocus || false}
			placeholder={placeholder || false}
			showLabel={showLabel || false}
			size={size || false}
			required={required}
		></sc-customer-name>
	);
};
