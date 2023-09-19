export default ({ attributes }) => {
	const {
		other_label,
		ca_gst_label,
		au_abn_label,
		gb_vat_label,
		eu_vat_label,
		help_text,
		tax_id_types,
	} = attributes;
	return (
		<sc-order-tax-id-input
			other-label={other_label || null}
			ca-gst-label={ca_gst_label || null}
			au-abn-label={au_abn_label || null}
			gb-vat-label={gb_vat_label || null}
			eu-vat-label={eu_vat_label || null}
			help-text={help_text || null}
			tax-id-types={JSON.stringify(tax_id_types)}
		></sc-order-tax-id-input>
	);
};
