/**
 * WordPress dependencies
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const { label, placeholder, required } = attributes;
	const [titleValue, setTitleValue] = useState('');

	const blockProps = useBlockProps({
		className: 'sc-product-review-form-title',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Label', 'surecart')}
						value={label}
						onChange={(value) => setAttributes({ label: value })}
						help={__('The label for the title input field.', 'surecart')}
					/>
					<TextControl
						label={__('Placeholder', 'surecart')}
						value={placeholder}
						onChange={(value) => setAttributes({ placeholder: value })}
						help={__('Placeholder text shown in the input field.', 'surecart')}
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
				<div className="title-input-container">
					{label && (
						<label className="sc-form-label title-label">
							{label}
							{required && <span className="required-indicator"> *</span>}
						</label>
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
			</div>
		</>
	);
}