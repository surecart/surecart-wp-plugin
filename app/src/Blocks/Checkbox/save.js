export default ( { className, attributes } ) => {
	const { name, checked, value, required, label } = attributes;

	return (
		<ce-checkbox
			class={ className || false }
			name={ name || false }
			checked={ checked || false }
			value={ value || false }
			required={ required || false }
		>
			{ label }
		</ce-checkbox>
	);
};
