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
	} = attributes;

	return (
		<ce-form-row className={ className }>
			<ce-input
				label={ label }
				clearable={ clearable }
				disabled={ disabled }
				help={ help }
				autofocus={ autofocus }
				autocomplete={ autocomplete }
				inputmode={ inputmode }
				max={ max }
				maxlength={ maxlength }
				min={ min }
				minlength={ minlength }
				name={ name }
				placeholder={ placeholder }
				readonly={ readonly }
				showLabel={ showLabel }
				size={ size }
				spellcheck={ spellcheck }
				step={ step }
				togglePassword={ togglePassword }
				type={ type }
				value={ value }
			></ce-input>
		</ce-form-row>
	);
};
