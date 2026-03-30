export default ({ attributes }) => {
	const { label, secure_notice, default_processor } = attributes;

	return (
		<sc-payment
			label={label}
			default-processor={default_processor}
			secure-notice={secure_notice}
		></sc-payment>
	);
};
