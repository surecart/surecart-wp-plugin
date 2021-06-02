export default ( { className, attributes } ) => {
	const { type, submit, full, size, text } = attributes;

	return (
		<div className={ className }>
			<presto-button
				type={ type }
				submit={ submit }
				full={ full }
				size={ size }
			>
				{ text }
			</presto-button>
		</div>
	);
};
