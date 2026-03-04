/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';
import {
	__experimentalUseColorProps as useColorProps,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import LabelControl from '../../components/LabelControl';
import StyleContentsControl from '../../components/StyleContentsControl';

export default ({ attributes, setAttributes }) => {
	const { label, hidden_label } = attributes;
	const { style: colorStyle, className } = useColorProps(attributes);
	const [mode, setMode] = useState('contentOnly');

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
			templateLock: mode,
		}
	);

	return (
		<>
			<LabelControl
				label={hidden_label}
				setLabel={(hidden_label) => setAttributes({ hidden_label })}
			/>
			<StyleContentsControl mode={mode} setMode={setMode} />

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
