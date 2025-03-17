import { Fragment, useState } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	TextControl,
	PanelBody,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';
import {
	ScAddress,
	ScSelect,
	ScCompactAddress,
	ScCheckbox,
	ScFlex,
} from '@surecart/components-react';
import { countryChoices } from '@surecart/components';

export default ({ attributes, setAttributes }) => {
	const {
		label,
		billing_label,
		billing_toggle_label,
		required,
		full,
		show_name,
		default_country,
		collect_billing,
	} = attributes;
	const [sameAsShipping, setSameAsShipping] = useState(false);
	const blockProps = useBlockProps();

	const Tag = full ? ScAddress : ScCompactAddress;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Required', 'surecart')}
							checked={required}
							onChange={(required) => setAttributes({ required })}
							help={
								!required &&
								__(
									'If tax or shipping is required for checkout the address field will automatically be required.',
									'surecart'
								)
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Shipping Address Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Collect Billing Address', 'surecart')}
							checked={collect_billing}
							onChange={(collect_billing) =>
								setAttributes({ collect_billing })
							}
							help={__(
								'If enabled, the user can enter a separate billing address. Otherwise, the billing address will be the same as the shipping address.',
								'surecart'
							)}
						/>
					</PanelRow>
					{collect_billing && (
						<PanelRow>
							<TextControl
								label={__('Billing Address Toggle', 'surecart')}
								value={billing_toggle_label}
								onChange={(billing_toggle_label) =>
									setAttributes({ billing_toggle_label })
								}
							/>
						</PanelRow>
					)}
					{!sameAsShipping && collect_billing && (
						<PanelRow>
							<TextControl
								label={__('Billing Address Label', 'surecart')}
								value={billing_label}
								onChange={(billing_label) =>
									setAttributes({ billing_label })
								}
							/>
						</PanelRow>
					)}
					<PanelRow>
						<ToggleControl
							label={__(
								'Use a compact address if possible',
								'surecart'
							)}
							checked={!full}
							onChange={(full) => {
								setAttributes({ full: !full });
								if (full) {
									setAttributes({ show_name: false });
								}
							}}
							help={__(
								'If products in the cart require tax but not shipping, we will show a condensed version specifically for tax collection.',
								'surecart'
							)}
						/>
					</PanelRow>
					{full && (
						<PanelRow>
							<ToggleControl
								label={__(
									'Show the "name or company name" field in the form.',
									'surecart'
								)}
								checked={show_name}
								onChange={(show_name) =>
									setAttributes({ show_name })
								}
							/>
						</PanelRow>
					)}

					<PanelRow>
						<ScSelect
							style={{ width: '100%' }}
							search
							label={__('Default country', 'surecart')}
							placeholder={__('Country', 'surecart')}
							choices={countryChoices}
							value={default_country}
							onScChange={(e) =>
								setAttributes({
									default_country: e.target.value,
								})
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScFlex
					flexDirection="column"
					style={{ '--sc-flex-column-gap': '25px' }}
				>
					<Tag
						label={label}
						showName={show_name}
						required={required}
						address={{
							country: default_country,
						}}
						defaultCountryFields={
							scBlockData.i18n.defaultCountryFields
						}
						countryFields={scBlockData.i18n.countryFields}
					/>

					{collect_billing && (
						<ScCheckbox
							checked={sameAsShipping}
							onScChange={(e) =>
								setSameAsShipping(e.target.checked)
							}
						>
							{billing_toggle_label}
						</ScCheckbox>
					)}
					{!sameAsShipping && collect_billing && (
						<ScAddress
							label={billing_label}
							showName={show_name}
							required={true}
							address={{
								country: default_country,
							}}
							defaultCountryFields={
								scBlockData.i18n.defaultCountryFields
							}
							countryFields={scBlockData.i18n.countryFields}
						/>
					)}
				</ScFlex>
			</div>
		</Fragment>
	);
};
