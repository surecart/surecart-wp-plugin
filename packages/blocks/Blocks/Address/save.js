export default ({ attributes, className }) => {
	const { label } = attributes;
	return <ce-address className={className} label={label}></ce-address>;
};
