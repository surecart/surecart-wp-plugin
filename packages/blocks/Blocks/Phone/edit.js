import { ScPhoneInput } from '@surecart/components-react';
import { InspectorControls } from '@wordpress/block-editor';
import { Disabled, PanelBody, PanelRow, TextControl, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { label, placeholder, help, required } = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Required', 'surecart')}
							checked={required}
							onChange={(required) => setAttributes({ required })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Placeholder', 'surecart')}
							value={placeholder}
							onChange={(placeholder) =>
								setAttributes({ placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Help', 'surecart')}
							value={help}
							onChange={(help) => setAttributes({ help })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<Disabled>
        <ScPhoneInput
        	required={required}
					label={label}
					placeholder={placeholder}
					help={help} />
			</Disabled>
		</Fragment>
	);
};
