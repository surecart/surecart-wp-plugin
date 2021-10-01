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
			clearable={ clearable || false }
			disabled={ disabled || false }
			help={ help || false }
			autofocus={ autofocus || false }
			autocomplete={ autocomplete || false }
			inputmode={ inputmode || false }
			max={ max || false }
			maxlength={ maxlength || false }
			min={ min || false }
			minlength={ minlength || false }
			name={ name || false }
			placeholder={ placeholder || false }
			readonly={ readonly || false }
			showLabel={ showLabel || false }
			size={ size || false }
			spellcheck={ spellcheck || false }
			step={ step || false }
			togglePassword={ togglePassword }
			type={ type || false }
			value={ value || false }
			required={ required || false }
		></ce-input>
	);
};
