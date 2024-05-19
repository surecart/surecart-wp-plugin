/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import {
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;
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
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<label className="sc-form-label">{label}</label>
				<div
					className="sc-input-group sc-quantity-selector"
					style={{
						...(borderStyle?.borderRadius
							? {
									'--border-radius': borderStyle.borderRadius,
							  }
							: {}),
					}}
				>
					<div className="sc-input-group-text sc-quantity-selector__decrease">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</div>
					<input
						className="sc-form-control sc-quantity-selector__control"
						value={0}
						type="number"
					/>
					<div className="sc-input-group-text sc-quantity-selector__increase">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</div>
				</div>
			</div>
		</>
	);
};
