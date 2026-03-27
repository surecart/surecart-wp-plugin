/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentControl,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Labels from './labels';

export default function Edit({ attributes, setAttributes }) {
	const { label, placeholder, text_align } = attributes;
	const blockProps = useBlockProps({
		style: {
			textAlign: text_align || 'left',
		},
	});

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={text_align}
					onChange={(nextAlign) => {
						setAttributes({ text_align: nextAlign });
					}}
				/>
			</BlockControls>
			<InspectorControls>
				<Labels attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>

			<div {...blockProps}>
				{label && (
					<RichText
						tagName="label"
						className="sc-form-label"
						aria-label={__('Label', 'surecart')}
						placeholder={__('Review Title', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				)}

				<input
					type="text"
					name="title"
					className="sc-form-control"
					placeholder={placeholder}
					required={true}
				/>
			</div>
		</>
	);
}
