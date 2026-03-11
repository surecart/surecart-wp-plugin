import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InnerBlocks,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	useBlockProps,
	store as blockEditorStore,
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
import { ScRadioGroup } from '@surecart/components-react';

import { useSelect } from '@wordpress/data';

export default ({ attributes, setAttributes, isSelected, clientId }) => {
	const { label, required } = attributes;
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const blockProps = useBlockProps();

	const childIsSelected = useSelect((select) =>
		select(blockEditorStore).hasSelectedInnerBlock(clientId, true)
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'sc-radio',
		},
		{
			allowedBlocks: ['surecart/radio'],
			template: [['surecart/radio', {}]],
			renderAppender:
				isSelected || childIsSelected
					? InnerBlocks.ButtonBlockAppender
					: false,
		}
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Label Name', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Required', 'surecart')}
							checked={required}
							onChange={(required) => setAttributes({ required })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScRadioGroup
					label={label}
					required={required}
					{...innerBlocksProps}
				></ScRadioGroup>
			</div>
		</Fragment>
	);
};
