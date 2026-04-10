/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScButton } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { type, text, submit, full, size } = attributes;

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<ScButton type={type} full={full} size={size}>
				<RichText
					aria-label={__('Button text')}
					placeholder={__('Add text…')}
					value={text}
					onChange={(value) => setAttributes({ text: value })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</ScButton>
		</div>
	);
};
