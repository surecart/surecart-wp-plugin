export default ( { className, attributes } ) => {
	const { type, submit, full, size, text } = attributes;

	return (
		<ce-form-row className={ className }>
			<ce-button
				type={ type }
				submit={ submit }
				full={ full ? '1' : '0' }
				size={ size }
			>
				{ text }
			</ce-button>
		</ce-form-row>
	);
};
