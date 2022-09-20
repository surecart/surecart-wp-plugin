/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls, 
	InnerBlocks,
	useInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
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
import { ScRadio, ScRadioGroup } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ className, attributes, setAttributes }) => {
	const { label, value, checked, name, required } = attributes;

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			className: 'sc-radio',
			allowedBlocks: ['surecart/radio'],
			//renderAppender: tru ? InnerBlocks.ButtonBlockAppender : false,
		}
	);

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
							label={__('Name', 'surecart')}
							value={name}
							onChange={(name) => setAttributes({ name })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Value', 'surecart')}
							value={value}
							onChange={(value) => setAttributes({ value })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Checked by default', 'surecart')}
							checked={checked}
							onChange={(checked) => setAttributes({ checked })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScRadioGroup label={label}>
					<div {...innerBlocksProps} />
				</ScRadioGroup>
			</div>
		</Fragment>
	);
};
