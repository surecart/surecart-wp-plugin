import { __ } from '@wordpress/i18n';

export default [
	{
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
	},
];
