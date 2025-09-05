/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import {
	__experimentalUseColorProps as useColorProps,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { label, hidden_label } = attributes;
	const { style: colorStyle, className } = useColorProps(attributes);

	const blockProps = useBlockProps({
		style: {
			display: 'block',
			...(colorStyle?.color
				? {
						'--sc-input-label-color': colorStyle.color,
						'--sc-focus-ring-color-primary': colorStyle.color,
						'--sc-input-border-color-focus': colorStyle.color,
				  }
				: {}),
		},
	});

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			allowedBlocks: ['surecart/product-quantity-control'],
			template: [['surecart/product-quantity-control', {}]],
			templateLock: 'all',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						label={__('Hide Label', 'surecart')}
						help={__(
							'Visually hide the label, but still keep it accessible to screen readers.',
							'surecart'
						)}
						checked={hidden_label}
						onChange={(hidden_label) =>
							setAttributes({ hidden_label })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{!hidden_label && (
					<RichText
						tagName="label"
						className={`sc-form-label ${className}`}
						aria-label={__('Label text', 'surecart')}
						placeholder={__('Add label…', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				)}

				<div {...innerBlocksProps}></div>
			</div>
		</>
	);
};
