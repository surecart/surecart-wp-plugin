export default ({ className, attributes }) => {
	const { label, help, autofocus, placeholder, showLabel, size } = attributes;

	return (
		<ce-email
			class={className || false}
			label={label || false}
			help={help || false}
			autofocus={autofocus || false}
			autocomplete={'email'}
			inputmode={'email'}
			placeholder={placeholder || false}
			showLabel={showLabel || false}
			size={size || false}
			required="1"
		></ce-email>
	);
};
