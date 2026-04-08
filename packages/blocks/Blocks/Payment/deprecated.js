export default [
	{
		attributes: {
			disabled_methods: {
				type: 'array',
			},
			secure_notice: {
				type: 'string',
				default: 'This is a secure, encrypted payment.',
			},
			label: {
				type: 'string',
				default: 'Payment',
			},
			default_processor: {
				type: 'string',
				default: 'stripe',
			},
		},
		save({ attributes, className }) {
			const { label, secure_notice, default_processor } = attributes;
			return (
				<sc-payment
					class={className}
					label={label}
					default-processor={default_processor}
					secure-notice={secure_notice}
				></sc-payment>
			);
		},
	},
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
