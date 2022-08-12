/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	InspectorControls,
	AlignmentControl,
	BlockControls,
} from '@wordpress/block-editor';
import { PanelColorSettings } from '@wordpress/editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalBoxControl as BoxControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScText } from '@surecart/components-react';
import useCartBlockProps from '../../hooks/useCartBlockProps';
import CartInspectorControls from '../../components/CartInspectorControls';

export default ({ attributes, setAttributes }) => {
	const { text, border, align, textColor, backgroundColor, padding } =
		attributes;

	const blockProps = useCartBlockProps({ attributes });

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={align}
					onChange={(newAlign) => setAttributes({ align: newAlign })}
				/>
			</BlockControls>

			<InspectorControls>
				<CartInspectorControls
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<ScText
					style={{
						'--font-size': 'var(--sc-font-size-x-small)',
						'--line-height': 'var(--sc-line-height-dense)',
						'--text-align': align,
					}}
				>
					<RichText
						aria-label={__('Message Text')}
						placeholder={__('I.E. Free shipping on all orders…')}
						value={text}
						onChange={(text) => setAttributes({ text })}
						withoutInteractiveFormatting
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/strikethrough',
						]}
					/>
				</ScText>
			</div>
		</>
	);
};
