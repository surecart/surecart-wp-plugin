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
		confirmation,
		confirmation_label,
		confirmation_placeholder,
		confirmation_help,
	} = attributes;

	return (
		<sc-order-password
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
			confirmation={confirmation ? '1' : null}
			confirmation-label={confirmation_label}
			confirmation-placeholder={confirmation_placeholder}
			confirmation-help={confirmation_help}
		></sc-order-password>
	);
};
