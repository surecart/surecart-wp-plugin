export default ({ attributes }) => {
	const { label } = attributes;
	return <sc-line-item-shipping label={label}></sc-line-item-shipping>;
};
