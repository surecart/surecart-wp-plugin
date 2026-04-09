import { ScPhoneInput } from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	Disabled,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { label, placeholder, help, required } = attributes;
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Required', 'surecart')}
							checked={required}
							onChange={(required) => setAttributes({ required })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Placeholder', 'surecart')}
							value={placeholder}
							onChange={(placeholder) =>
								setAttributes({ placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Help', 'surecart')}
							value={help}
							onChange={(help) => setAttributes({ help })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<Disabled>
					<ScPhoneInput
						required={required}
						label={label}
						placeholder={placeholder}
						help={help}
					/>
				</Disabled>
			</div>
		</Fragment>
	);
};
