/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScSwitch } from '@surecart/components-react';

export default ({ attributes, setAttributes, isSelected }) => {
	const { label, value, checked, name, required, description } = attributes;

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
				{!isSelected && !name && (
					<div>{__('Please add a name', 'surecart')}</div>
				)}

				<ScSwitch name={name} required={required} edit>
					<RichText
						tagName="span"
						aria-label={__('Switch label', 'surecart')}
						placeholder={__('Add some text...', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
					/>
					{(description || isSelected) && (
						<RichText
							tagName="span"
							slot="description"
							aria-label={__('Switch label', 'surecart')}
							placeholder={__(
								'Enter a description...',
								'surecart'
							)}
							value={description}
							onChange={(description) =>
								setAttributes({ description })
							}
						/>
					)}
				</ScSwitch>
			</div>
		</Fragment>
	);
};
