export default ({ className, attributes }) => {
	const { type, submit, full, size, text } = attributes;

	return (
		<sc-form-row className={className}>
			<sc-button
				type={type}
				submit={submit}
				full={full ? '1' : '0'}
				size={size}
			>
				{text}
			</sc-button>
		</sc-form-row>
	);
};
