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
	const { label } = attributes;

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
						<TextControl
							label={__('Label Name', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
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
