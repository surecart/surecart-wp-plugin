export default ( { attributes } ) => {
	const { removable, editable } = attributes;
	return (
		<ce-line-items
			removable={ removable ? '1' : 'false' }
			editable={ editable ? '1' : 'false' }
		></ce-line-items>
	);
};
