export default ( { className, attributes } ) => {
	const { type, text, submit, full, size } = attributes;

	return (
		<div className={ className }>
			<ce-form-row>
				<ce-button
					type={ type }
					submit={ submit }
					full={ full }
					size={ size }
				>
					{ text }
				</ce-button>
			</ce-form-row>
		</div>
	);
};
