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
		placeholder,
		readonly,
		showLabel,
		size,
		spellcheck,
		step,
		togglePassword,
		value,
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
			placeholder={ placeholder || false }
			readonly={ readonly || false }
			showLabel={ showLabel || false }
			size={ size || false }
			spellcheck={ spellcheck || false }
			step={ step || false }
			togglePassword={ togglePassword }
			value={ value || false }
			name={ 'name' }
			type={ 'text' }
		></ce-input>
	);
};
