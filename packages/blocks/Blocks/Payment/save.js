export default ({ className, attributes }) => {
	const { label, secure_notice, default_processor } = attributes;

	return (
		<sc-payment
			class={className}
			label={label}
			default={default_processor || 'stripe'}
			secure-notice={secure_notice}
		></sc-payment>
	);
};
