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
		save({ attributes, className }) {
			const {
				other_label,
				ca_gst_label,
				au_abn_label,
				gb_vat_label,
				eu_vat_label,
			} = attributes;

			return (
				<sc-order-tax-id-input
					other-label={other_label || null}
					ca-gst-label={ca_gst_label || null}
					au-abn-label={au_abn_label || null}
					gb-vat-label={gb_vat_label || null}
					eu-vat-label={eu_vat_label || null}
				></sc-order-tax-id-input>
			);
		},
	},
	{
		attributes: {},
		supports: {
			className: false,
		},
		save() {
			return <sc-order-tax-id-input></sc-order-tax-id-input>;
		},
	},
];
