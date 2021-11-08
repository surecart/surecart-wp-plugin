export default ( { className, attributes } ) => {
	const {
		label,
		clearable,
		disabled,
		help,
		autofocus,
		autocomplete,
		inputmode,
		max,
		maxlength,
		min,
		minlength,
		name,
		placeholder,
		readonly,
		showLabel,
		size,
		spellcheck,
		step,
		togglePassword,
		type,
		value,
		required,
	} = attributes;

	return (
		<ce-input
			class={ className || false }
			label={ label || false }
			help={ help || false }
			autofocus={ autofocus || false }
			maxlength={ maxlength || false }
			minlength={ minlength || false }
			placeholder={ placeholder || false }
			showLabel={ showLabel || false }
			size={ size || false }
			type={ 'password' }
			name={ 'password' }
			value={ value }
			required="1"
		></ce-input>
	);
};
