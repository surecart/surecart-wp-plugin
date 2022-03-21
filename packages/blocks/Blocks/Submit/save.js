export default ({ attributes }) => {
	const { type, full, size, text, show_total, show_icon } = attributes;

	return (
		<ce-order-submit
			type={type}
			full={full ? 'true' : false}
			size={size}
			icon={show_icon ? 'lock' : false}
			show-total={show_total ? 'true' : false}
		>
			{text}
		</ce-order-submit>
	);
};
