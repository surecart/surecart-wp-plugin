import { Fragment, useState, useMemo } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	TextControl,
	PanelBody,
	ToggleControl,
	ComboboxControl,
} from '@wordpress/components';
import {
	ScAddress,
	ScCompactAddress,
	ScCheckbox,
	ScFlex,
} from '@surecart/components-react';
import { useCountries } from '@admin/hooks/useAtlas';

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
		line_2,
	} = attributes;
	const [sameAsShipping, setSameAsShipping] = useState(false);
	const blockProps = useBlockProps();
	const { countries, loading: isLoading } = useCountries();
	const choices = useMemo(
		() => countries.map(({ code, name }) => ({ value: code, label: name })),
		[countries]
	);

	const Tag = full ? ScAddress : ScCompactAddress;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
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

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Shipping Address Label', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
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

					{collect_billing && (
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Billing Address Toggle', 'surecart')}
							value={billing_toggle_label}
							onChange={(billing_toggle_label) =>
								setAttributes({ billing_toggle_label })
							}
						/>
					)}

					{!sameAsShipping && collect_billing && (
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Billing Address Label', 'surecart')}
							value={billing_label}
							onChange={(billing_label) =>
								setAttributes({ billing_label })
							}
						/>
					)}

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Use a compact address', 'surecart')}
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

					{full && (
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Name or company name', 'surecart')}
							help={__(
								'If enabled, the name or company name field will be shown.',
								'surecart'
							)}
							checked={show_name}
							onChange={(show_name) =>
								setAttributes({ show_name })
							}
						/>
					)}

					{full && (
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Show address line 2', 'surecart')}
							checked={line_2}
							help={__(
								'If enabled, the address line 2 field will be shown.',
								'surecart'
							)}
							onChange={(line_2) => setAttributes({ line_2 })}
						/>
					)}

					<ComboboxControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Default country', 'surecart')}
						placeholder={__('Country', 'surecart')}
						options={choices}
						value={default_country}
						onChange={(value) =>
							setAttributes({ default_country: value ?? '' })
						}
						isLoading={isLoading}
					/>
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
						showLine2={line_2}
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
							showLine2={line_2}
						/>
					)}
				</ScFlex>
			</div>
		</Fragment>
	);
};
