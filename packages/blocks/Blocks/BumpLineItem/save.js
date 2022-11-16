export default ({ attributes }) => {
	const { label, className } = attributes;
	return (
		<sc-line-item-bump class={className} label={label}></sc-line-item-bump>
	);
};
