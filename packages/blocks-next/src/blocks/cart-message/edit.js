/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import { ScText } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { text, align } = attributes;
	const blockProps = useBlockProps();

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
