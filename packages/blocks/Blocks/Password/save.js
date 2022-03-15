export default ({ className, attributes }) => {
	const {
		label,
		help,
		autofocus,
		maxlength,
		minlength,
		placeholder,
		showLabel,
		size,
		value,
		required,
	} = attributes;

	return (
		<ce-order-password
			class={className}
			label={label}
			help={help}
			autofocus={autofocus}
			maxlength={maxlength}
			minlength={minlength}
			placeholder={placeholder}
			showLabel={showLabel}
			size={size ? size : 'medium'}
			type="password"
			name="password"
			value={value}
			required={required}
		></ce-order-password>
	);
};
