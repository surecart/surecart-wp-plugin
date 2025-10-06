/**
 * WordPress dependencies
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const { label, placeholder, required, rows } = attributes;
	const [contentValue, setContentValue] = useState('');

	const blockProps = useBlockProps({
		className: 'sc-product-review-form-content',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Label', 'surecart')}
						value={label}
						onChange={(value) => setAttributes({ label: value })}
						help={__('The label for the content textarea field.', 'surecart')}
					/>
					<TextControl
						label={__('Placeholder', 'surecart')}
						value={placeholder}
						onChange={(value) => setAttributes({ placeholder: value })}
						help={__('Placeholder text shown in the textarea field.', 'surecart')}
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
						help={__('Number of visible text lines for the textarea.', 'surecart')}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div className="content-textarea-container">
					{label && (
						<label className="sc-form-label">
							{label}
							{required && <span className="required-indicator"> *</span>}
						</label>
					)}
					<textarea
						className="content-textarea"
						placeholder={placeholder}
						value={contentValue}
						onChange={(e) => setContentValue(e.target.value)}
						required={required}
						rows={rows}
						name="content"
					/>
				</div>
			</div>
		</>
	);
}