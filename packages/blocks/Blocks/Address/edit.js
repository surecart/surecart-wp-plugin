import { Fragment } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	TextControl,
	PanelBody,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';
import { ScAddress, ScSelect } from '@surecart/components-react';
import { address } from '@surecart/components';

export default ({ attributes, setAttributes }) => {
	const { label, full, show_name, default_country } = attributes;
	const { countryChoices } = address;

	const blockProps = useBlockProps({
		label,
		showName: show_name,
		defaultCountry: default_country,
	});

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
					<PanelRow>
						<ScSelect
							search
							label={__('Choose default country.', 'surecart')}
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

			<ScAddress {...blockProps}></ScAddress>
		</Fragment>
	);
};
