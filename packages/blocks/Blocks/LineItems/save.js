export default ({ attributes }) => {
	const { removable, editable, showAllBundleItems = true } = attributes;
	return (
		<sc-line-items
			removable={removable ? '1' : 'false'}
			editable={editable ? '1' : 'false'}
			{...( showAllBundleItems === false
				? { 'show-all-bundle-items': 'false' }
				: {} )}
		></sc-line-items>
	);
};
