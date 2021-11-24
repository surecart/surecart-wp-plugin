export default ( { className, attributes } ) => {
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
