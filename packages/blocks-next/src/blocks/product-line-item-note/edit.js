/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import Labels from './labels';
import Settings from './settings';

export default ({ attributes, setAttributes }) => {
	const { label, placeholder, help_text, no_of_rows } = attributes;
	const { style: borderStyle } = useBorderProps(attributes);
	const { style: colorStyle } = useColorProps(attributes);

	const blockProps = useBlockProps({
		style: {
			display: 'block',
			...(colorStyle?.color
				? {
						'--sc-input-label-color': colorStyle.color,
						'--sc-focus-ring-color-primary': colorStyle.color,
						'--sc-input-border-color-focus': colorStyle.color,
				  }
				: {}),
		},
	});

	return (
		<>
			<InspectorControls>
				<Labels attributes={attributes} setAttributes={setAttributes} />
				<Settings
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div {...blockProps}>
				<RichText
					tagName="label"
					className={`sc-form-label ${colorStyle.className}`}
					aria-label={__('Label text', 'surecart')}
					placeholder={__('Add label…', 'surecart')}
					value={label || __('Note', 'surecart')}
					onChange={(label) => setAttributes({ label })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
				<textarea
					className="sc-form-control"
					placeholder={
						placeholder || __('Add a note (optional)', 'surecart')
					}
					rows={no_of_rows || 2}
					style={{
						...(borderStyle?.borderRadius
							? {
									'border-radius': borderStyle.borderRadius,
							  }
							: {}),
					}}
				></textarea>
				{help_text && <div className="sc-help-text">{help_text}</div>}
			</div>
		</>
	);
};
