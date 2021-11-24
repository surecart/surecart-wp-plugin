export default ( { attributes } ) => {
	const { type, full, size, text, show_total } = attributes;

	return (
		<ce-button
			submit="1"
			type={ type }
			full={ full ? '1' : false }
			size={ size }
		>
			{ text }
			{ show_total && (
				<span>
					{ '\u00A0' }
					<ce-total></ce-total>
				</span>
			) }
		</ce-button>
	);
};
