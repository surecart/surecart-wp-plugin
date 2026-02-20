/**
 * Component Dependencies
 */
import { ScRadio } from '@surecart/components-react';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import {
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

export default ({ className, attributes, setAttributes }) => {
	const { label, value, checked, name } = attributes;

	const blockProps = useBlockProps({
		className,
		style: {
			display: 'block',
		},
	});

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Name', 'surecart')}
							value={name}
							onChange={(name) => setAttributes({ name })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Value', 'surecart')}
							value={value}
							onChange={(value) => setAttributes({ value })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Checked by default', 'surecart')}
							checked={checked}
							onChange={(checked) => setAttributes({ checked })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScRadio
					name={name}
					checked={checked}
					edit
				>
					<RichText
						aria-label={__('Radio Text', 'surecart')}
						placeholder={__(
							'Click here to add some radio text...',
							'surecart'
						)}
						value={label}
						onChange={(label) => setAttributes({ label })}
					/>
				</ScRadio>
			</div>
		</Fragment>
	);
};
