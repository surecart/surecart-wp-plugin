export default ({ className, attributes }) => {
	const { label, secure_notice } = attributes;

	return (
		<sc-payment
			class={className}
			label={label}
			secure-notice={secure_notice}
		></sc-payment>
	);
};
