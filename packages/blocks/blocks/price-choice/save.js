export default ( { attributes } ) => {
	const {
		price_id,
		type,
		quantity,
		show_price,
		show_label,
		show_control,
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
			show-label={ show_label ? '1' : 'false' }
			show-price={ show_price ? '1' : 'false' }
			show-control={ show_control ? '1' : 'false' }
			quantity={ quantity }
		></ce-price-choice>
	);
};
