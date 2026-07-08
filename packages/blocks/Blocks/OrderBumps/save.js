export default ({ attributes, className }) => {
	const { label, show_control, hide_added_items } = attributes;
	return (
		<sc-order-bumps
			className={className}
			label={label}
			show-control={show_control ? '1' : 'false'}
			hide-added-items={hide_added_items ? '1' : undefined}
		></sc-order-bumps>
	);
};
