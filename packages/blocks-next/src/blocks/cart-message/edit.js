/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import useCartStyles from '../../hooks/useCartStyles';
import CartInspectorControls from '../../components/CartInspectorControls';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	const blockProps = useBlockProps({
		style: {
			...useCartStyles({ attributes }),
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
