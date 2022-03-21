export default ({ attributes }) => {
	const { removable, editable } = attributes;
	return (
		<sc-line-items
			removable={removable ? '1' : 'false'}
			editable={editable ? '1' : 'false'}
		></sc-line-items>
	);
};
