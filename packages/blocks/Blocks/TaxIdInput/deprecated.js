export default [
	{
		attributes: {
			other_label: {
				type: 'string',
			},
		},
		supports: {
			className: false,
		},
		migrate({ other_label }) {
			return {};
		},
		save() {
			return <sc-order-tax-id-input></sc-order-tax-id-input>;
		},
	},
];
