export default ( { className, attributes } ) => {
	const { text } = attributes;

	return <ce-divider>{ text }</ce-divider>;
};
