export default ({ attributes, className }) => {
	const { label, show_control } = attributes;
	return (
		<sc-order-bumps
			className={className}
			label={label}
			show-control={show_control ? '1' : 'false'}
		></sc-order-bumps>
	);
};
