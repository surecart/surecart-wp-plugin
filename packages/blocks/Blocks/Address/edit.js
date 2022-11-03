import { Fragment } from '@wordpress/element';
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
} from '@surecart/components-react';
import { countryChoices } from '@surecart/components';

export default ({ attributes, setAttributes }) => {
	const {
		label,
		full,
		show_name,
		default_country,
		name_placeholder,
		country_placeholder,
		city_placeholder,
		line_1_placeholder,
		postal_code_placeholder,
		state_placeholder,
	} = attributes;

	const blockProps = useBlockProps();

	const Tag = full ? ScAddress : ScCompactAddress;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
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
					{show_name && (
						<PanelRow>
							<TextControl
								label={__('Name Placeholder', 'surecart')}
								value={name_placeholder}
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
							onChange={(country_placeholder) =>
								setAttributes({ country_placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('City Placeholder', 'surecart')}
							value={city_placeholder}
							onChange={(city_placeholder) =>
								setAttributes({ city_placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Address Placeholder', 'surecart')}
							value={line_1_placeholder}
							onChange={(line_1_placeholder) =>
								setAttributes({ line_1_placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Postal Code Placeholder', 'surecart')}
							value={postal_code_placeholder}
							onChange={(postal_code_placeholder) =>
								setAttributes({ postal_code_placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('State Placeholder', 'surecart')}
							value={state_placeholder}
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
				<Tag
					label={label}
					showName={show_name}
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
				/>
			</div>
		</Fragment>
	);
};
