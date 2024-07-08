/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	AlignmentControl,
	InspectorControls,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import useCartStyles from '../../hooks/useCartStyles';
import CartInspectorControls from '../../components/CartInspectorControls';

export default ({ attributes, setAttributes }) => {
	const { text, align } = attributes;

	const blockProps = useBlockProps({
		style: {
			...useCartStyles({ attributes }),
			textAlign: align,
		},
	});

	return (
		<>
			<InspectorControls>
				<CartInspectorControls
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<BlockControls group="block">
				<AlignmentControl
					value={align}
					onChange={(newAlign) => setAttributes({ align: newAlign })}
				/>
			</BlockControls>

			<div {...blockProps}>
				<RichText
					aria-label={__('Message Text', 'surecart')}
					placeholder={__(
						'I.E. Free shipping on all orders…',
						'surecart'
					)}
					value={text}
					onChange={(text) => setAttributes({ text })}
					withoutInteractiveFormatting
					allowedFormats={[
						'core/bold',
						'core/italic',
						'core/strikethrough',
					]}
				/>
			</div>
		</>
	);
};
