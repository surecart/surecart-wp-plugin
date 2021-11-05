export default ( { attributes } ) => {
	const {
		price_id,
		type,
		quantity,
		label,
		description,
		checked,
	} = attributes;
	return (
		<ce-price-choice
			price-id={ price_id }
			type={ type }
			label={ label }
			description={ description }
			checked={ checked }
			quantity={ quantity }
		></ce-price-choice>
	);
};
