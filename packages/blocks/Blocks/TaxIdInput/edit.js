import { ScOrderTaxIdInput } from '@surecart/components-react';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from 'react';

export default ({ attributes, setAttributes }) => {
	const {
		other_label,
		ca_gst_label,
		au_abn_label,
		gb_vat_label,
		eu_vat_label,
	} = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('CA GST Label', 'surecart')}
							value={ca_gst_label}
							placeholder={__('GST Number', 'surecart')}
							onChange={(ca_gst_label) =>
								setAttributes({ ca_gst_label })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('AU ABN Label', 'surecart')}
							value={au_abn_label}
							placeholder={__('ABN Number', 'surecart')}
							onChange={(au_abn_label) =>
								setAttributes({ au_abn_label })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('UK VAT Label', 'surecart')}
							value={gb_vat_label}
							placeholder={__('UK VAT', 'surecart')}
							onChange={(gb_vat_label) =>
								setAttributes({ gb_vat_label })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('EU VAT Label', 'surecart')}
							value={eu_vat_label}
							placeholder={__('EU VAT', 'surecart')}
							onChange={(eu_vat_label) =>
								setAttributes({ eu_vat_label })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Other Label', 'surecart')}
							value={other_label}
							placeholder={__('Tax ID', 'surecart')}
							onChange={(other_label) =>
								setAttributes({ other_label })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ScOrderTaxIdInput
				show={true}
				otherLabel={other_label || null}
				caGstLabel={ca_gst_label || null}
				auAbnLabel={au_abn_label || null}
				gbVatLabel={gb_vat_label || null}
				euVatLabel={eu_vat_label || null}
			></ScOrderTaxIdInput>
		</Fragment>
	);
};
