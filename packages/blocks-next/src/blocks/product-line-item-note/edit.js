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
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import {
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { label, placeholder, showLabel, help } = attributes;
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
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Placeholder', 'surecart')}
							value={placeholder}
							onChange={(placeholder) =>
								setAttributes({ placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Label', 'surecart')}
							checked={showLabel}
							onChange={(showLabel) =>
								setAttributes({ showLabel })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Help Text', 'surecart')}
							value={help}
							onChange={(help) => setAttributes({ help })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{showLabel && (
					<RichText
						tagName="label"
						className={`sc-form-label ${colorStyle.className}`}
						aria-label={__('Label text', 'surecart')}
						placeholder={__('Add label…', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				)}
				<textarea
					className="sc-form-control"
					placeholder={placeholder}
					rows="3"
					style={{
						...(borderStyle?.borderRadius
							? {
									'border-radius': borderStyle.borderRadius,
							  }
							: {}),
					}}
				></textarea>
			</div>
		</>
	);
};
