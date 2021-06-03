export default ( { className, attributes } ) => {
	const { type, submit, full, size, text } = attributes;

	return (
		<ce-form-row className={ className }>
			<ce-button
				type={ type }
				submit={ submit }
				full={ full }
				size={ size }
			>
				{ text }
			</ce-button>
		</ce-form-row>
	);
};
