/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScFormControl,
	ScOrderTaxIdInput,
	ScSelect,
	ScTag,
} from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const {
		other_label,
		ca_gst_label,
		au_abn_label,
		gb_vat_label,
		eu_vat_label,
		help_text,
		tax_id_types,
	} = attributes;

	const zones = [
		{ value: 'ca_gst', label: __('CA GST', 'surecart') },
		{ value: 'au_abn', label: __('AU ABN', 'surecart') },
		{ value: 'gb_vat', label: __('UK VAT', 'surecart') },
		{ value: 'eu_vat', label: __('EU VAT', 'surecart') },
		{ value: 'other', label: __('Other', 'surecart') },
	];

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
					<PanelRow>
						<TextControl
							label={__('Help Text', 'surecart')}
							value={help_text}
							onChange={(help_text) =>
								setAttributes({ help_text })
							}
						/>
					</PanelRow>
				</PanelBody>

				<PanelBody title={__('Filter By Tax ID Types', 'surecart')}>
					<div
						css={css`
							display: grid;
							gap: 0.5em;
						`}
					>
						<ScFormControl
							css={css`
								margin-bottom: 0.5em;
							`}
						>
							{!!(tax_id_types || [])?.length && (
								<div
									css={css`
										display: flex;
										flex-wrap: wrap;
										gap: 0.5em;
									`}
								>
									{(tax_id_types || []).map((type) => (
										<ScTag
											key={type}
											css={css`
												margin-right: 0.5em;
												margin-bottom: 0.5em;
											`}
											clearable
											onScClear={() =>
												setAttributes({
													tax_id_types: (
														tax_id_types || []
													).filter(
														(taxType) =>
															taxType !== type
													),
												})
											}
										>
											{
												zones.find(
													(zone) =>
														zone.value === type
												)?.label
											}
										</ScTag>
									))}
								</div>
							)}
						</ScFormControl>

						<ScSelect
							value={''}
							onScChange={(e) => {
								setAttributes({
									tax_id_types: [
										...(tax_id_types || []),
										e.target.value,
									],
								});
							}}
							choices={
								!!(tax_id_types || []).length
									? zones.filter((zone) => {
											return !tax_id_types.includes(
												zone.value
											);
									  })
									: zones
							}
						/>
					</div>
				</PanelBody>
			</InspectorControls>
			<ScOrderTaxIdInput
				show={true}
				otherLabel={other_label || null}
				caGstLabel={ca_gst_label || null}
				auAbnLabel={au_abn_label || null}
				gbVatLabel={gb_vat_label || null}
				euVatLabel={eu_vat_label || null}
				helpText={help_text || null}
				taxIdTypes={JSON.stringify(tax_id_types)}
			></ScOrderTaxIdInput>
		</Fragment>
	);
};
