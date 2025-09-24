/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { PlainText, useBlockProps } from '@wordpress/block-editor';

export default ({ attributes, setAttributes, context: { show_label } }) => {
	const blockProps = useBlockProps();
	const { label } = attributes;

	return (
		<span {...blockProps}>
			{show_label && (
				<PlainText
					__experimentalVersion={2}
					tagName="span"
					aria-label={__('Total rating label', 'surecart')}
					placeholder={__('reviews', 'surecart')}
					value={label}
					onChange={(newLabel) => setAttributes({ label: newLabel })}
				/>
			)}
		</span>
	);
};
