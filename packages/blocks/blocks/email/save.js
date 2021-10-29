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
	} = attributes;

	return (
		<ce-input
			class={ className }
			label={ label }
			clearable={ clearable ? '1' : '' }
			disabled={ disabled ? '1' : '' }
			help={ help }
			autofocus={ autofocus ? '1' : '' }
			autocomplete={ autocomplete ? '1' : '' }
			inputmode={ inputmode }
			max={ max }
			maxlength={ maxlength }
			min={ min }
			minlength={ minlength }
			name={ name }
			placeholder={ placeholder }
			readonly={ readonly ? '1' : '' }
			showLabel={ showLabel ? '1' : '' }
			size={ size }
			spellcheck={ spellcheck ? '1' : '' }
			step={ step }
			togglePassword={ togglePassword ? '1' : '' }
			type="email"
			name="email"
			required="1"
		></ce-input>
	);
};
