/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const { label, placeholder, required, rows, textAlign } = attributes;
	const [contentValue, setContentValue] = useState('');

	const blockProps = useBlockProps({
		className: 'sc-product-review-form-content',
		style: {
			textAlign: textAlign,
		},
	});

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Placeholder', 'surecart')}
						value={placeholder}
						onChange={(value) =>
							setAttributes({ placeholder: value })
						}
						help={__(
							'Placeholder text shown in the textarea field.',
							'surecart'
						)}
					/>
					<ToggleControl
						label={__('Required', 'surecart')}
						checked={required}
						onChange={(value) => setAttributes({ required: value })}
						help={__('Make this field required.', 'surecart')}
					/>
					<RangeControl
						label={__('Rows', 'surecart')}
						value={rows}
						onChange={(value) => setAttributes({ rows: value })}
						min={2}
						max={10}
						help={__(
							'Number of visible text lines for the textarea.',
							'surecart'
						)}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{label && (
					<RichText
						tagName="label"
						className="sc-form-label"
						aria-label={__('Label', 'surecart')}
						placeholder={__('Review Content', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				)}
				<textarea
					className="sc-form-control"
					placeholder={placeholder}
					value={contentValue}
					onChange={(e) => setContentValue(e.target.value)}
					required={required}
					rows={rows}
					name="content"
				/>
			</div>
		</>
	);
}
