import { __ } from '@wordpress/i18n';

const v1 = {
	attributes: {},
	migrate() {
		return {
			other_label: __('Tax ID', 'surecart'),
			ca_gst_label: __('GST Number', 'surecart'),
			au_abn_label: __('ABN Number', 'surecart'),
			gb_vat_label: __('UK VAT', 'surecart'),
			eu_vat_label: __('EU VAT', 'surecart'),
		};
	},
	save() {
		return <sc-order-tax-id-input></sc-order-tax-id-input>;
	},
};

const v2 = {
	attributes: {},
	save({ attributes }) {
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
};

const v3 = {
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
		help_text: {
			type: 'string',
			default: '',
		},
		tax_id_types: {
			type: 'array',
			default: [],
		},
	},
	save({ attributes }) {
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
	},
};

export default [v1, v2, v3];
