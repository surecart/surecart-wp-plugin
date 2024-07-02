/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	AlignmentControl,
	BlockControls,
} from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import useCartBlockProps from '../../hooks/useCartBlockProps';

export default ({ attributes, setAttributes }) => {
	const { text, align } = attributes;

  const blockProps = useCartBlockProps({ attributes });

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={align}
					onChange={(newAlign) => setAttributes({ align: newAlign })}
				/>
			</BlockControls>

			<div {...blockProps}>
				<div
					className="sc-text"
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
				</div>
			</div>
		</>
	);
};
