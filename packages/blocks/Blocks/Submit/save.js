export default ({ attributes }) => {
	const {
		type,
		full,
		size,
		text,
		show_total,
		show_icon,
		secure_notice_text,
		show_secure_notice,
	} = attributes;

	return (
		<sc-order-submit
			type={type}
			full={full ? 'true' : false}
			size={size}
			icon={show_icon ? 'lock' : false}
			show-total={show_total ? 'true' : false}
			secure-notice={show_secure_notice ? 'true' : false}
			secure-notice-text={secure_notice_text}
		>
			{text}
		</sc-order-submit>
	);
};
