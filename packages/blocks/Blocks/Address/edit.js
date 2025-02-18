import { css, jsx } from '@emotion/react';
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
		name_placeholder,
		country_placeholder,
		city_placeholder,
		line_1_placeholder,
		postal_code_placeholder,
		state_placeholder,
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
						<h2
							css={css`
								padding: 0;
								margin: 0;
							`}
						>
							{__('Placeholder settings', 'surecart')}
						</h2>
					</PanelRow>
					<p>
						{__(
							'Enable the placeholders only if you want to modify, it would be changed according to the selected country.',
							'surecart'
						)}
					</p>
					{show_name && (
						<PanelRow>
							<TextControl
								label={__('Name Placeholder', 'surecart')}
								value={name_placeholder}
								placeholder={__(
									'Name or Company Name',
									'surecart'
								)}
								onChange={(name_placeholder) =>
									setAttributes({ name_placeholder })
								}
							/>
						</PanelRow>
					)}
					<PanelRow>
						<TextControl
							label={__('Country Placeholder', 'surecart')}
							value={country_placeholder}
							placeholder={__('Country', 'surecart')}
							onChange={(country_placeholder) =>
								setAttributes({ country_placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('City Placeholder', 'surecart')}
							value={city_placeholder}
							placeholder={__('City', 'surecart')}
							onChange={(city_placeholder) =>
								setAttributes({ city_placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Address Placeholder', 'surecart')}
							value={line_1_placeholder}
							placeholder={__('Address', 'surecart')}
							onChange={(line_1_placeholder) =>
								setAttributes({ line_1_placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Postal Code Placeholder', 'surecart')}
							value={postal_code_placeholder}
							placeholder={__('Postal Code/Zip', 'surecart')}
							onChange={(postal_code_placeholder) =>
								setAttributes({ postal_code_placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('State Placeholder', 'surecart')}
							value={state_placeholder}
							placeholder={__(
								'State/Province/Region',
								'surecart'
							)}
							onChange={(state_placeholder) =>
								setAttributes({ state_placeholder })
							}
						/>
					</PanelRow>
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
						placeholders={{
							name: name_placeholder,
							country: country_placeholder,
							city: city_placeholder,
							line_1: line_1_placeholder,
							postal_code: postal_code_placeholder,
							state: state_placeholder,
						}}
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
							placeholders={{
								name: name_placeholder,
								country: country_placeholder,
								city: city_placeholder,
								line_1: line_1_placeholder,
								postal_code: postal_code_placeholder,
								state: state_placeholder,
							}}
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
