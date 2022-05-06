export default [
	{
		attributes: {
			secure_notice: {
				type: 'string',
				default: 'This is a secure, encrypted payment.',
			},
			label: {
				type: 'string',
				default: 'Payment',
			},
		},
		save({ attributes, className }) {
			const { label, secure_notice } = attributes;
			return (
				<sc-payment
					class={className}
					label={label}
					secure-notice={secure_notice}
				></sc-payment>
			);
		},
	},
];
