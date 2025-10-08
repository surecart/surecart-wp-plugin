/**
 * WordPress dependencies
 */
import { useBlockProps, InspectorControls, RichText, BlockControls, AlignmentControl } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const { label, placeholder, required, textAlign } = attributes;
	const [titleValue, setTitleValue] = useState('');

	const blockProps = useBlockProps({
		className: 'sc-product-review-form-title',
		style: {
			textAlign: textAlign
		}
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
							'Placeholder text shown in the input field.',
							'surecart'
						)}
					/>
					<ToggleControl
						label={__('Required', 'surecart')}
						checked={required}
						onChange={(value) => setAttributes({ required: value })}
						help={__('Make this field required.', 'surecart')}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{label && (
					<RichText
						tagName="label"
						className="sc-form-label title-label"
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
					className="sc-form-control title-input"
					placeholder={placeholder}
					value={titleValue}
					onChange={(e) => setTitleValue(e.target.value)}
					required={required}
					name="title"
				/>
			</div>
		</>
	);
}
