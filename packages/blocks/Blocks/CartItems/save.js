export default function save({ attributes }) {
	const { removable, editable } = attributes;

	return (
		<sc-line-items
			removable={removable ? 'true' : 'false'}
			editable={editable ? 'true' : 'false'}
		></sc-line-items>
	);
}
