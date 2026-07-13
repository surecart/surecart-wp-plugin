export default ({ attributes }) => {
	const {
		removable,
		editable,
		showAllBundleItems = true,
		separator = '·',
	} = attributes;
	return (
		<sc-line-items
			removable={removable ? '1' : 'false'}
			editable={editable ? '1' : 'false'}
			{...(showAllBundleItems === false
				? { 'show-all-bundle-items': 'false' }
				: {})}
			{...(separator && separator !== '·' ? { separator } : {})}
		></sc-line-items>
	);
};
