export default [
	{
		attributes: {
			other_label: {
				type: 'string',
			},
			ca_gst_label: {
				type: 'string',
			},
			au_abn_label: {
				type: 'string',
			},
			gb_vat_label: {
				type: 'string',
			},
			eu_vat_label: {
				type: 'string',
			},
		},
		supports: {
			className: false,
		},
		save() {
			return <sc-order-tax-id-input></sc-order-tax-id-input>;
		},
	},
];
