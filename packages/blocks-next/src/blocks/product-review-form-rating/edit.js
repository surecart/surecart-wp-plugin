/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';

export default function Edit({ attributes, setAttributes, clientId }) {
	const { label, fill_color, size = 24 } = attributes;
	const [hoverRating, setHoverRating] = useState(0);
	const [selectedRating, setSelectedRating] = useState(0);

	const blockProps = useBlockProps({
		className: 'sc-product-review-form-rating',
	});

	const stars = [];
	const points =
		'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';

	for (let i = 1; i <= 5; i++) {
		const isFilled = i <= (hoverRating || selectedRating);

		stars.push(
			<button
				key={i}
				type="button"
				className={`star-button ${isFilled ? 'filled' : ''}`}
				style={{ width: `${size}px`, height: `${size}px` }}
				onMouseEnter={() => setHoverRating(i)}
				onMouseLeave={() => setHoverRating(0)}
				onClick={() => setSelectedRating(i)}
				aria-label={__(`Rate ${i} stars`, 'surecart')}
			>
				<svg
					className="star-svg"
					viewBox="0 0 24 24"
					width={size}
					height={size}
				>
					<polygon
						points={points}
						fill={
							isFilled
								? fill_color || 'var(--sc-color-primary-500)'
								: 'none'
						}
						stroke={fill_color || 'var(--sc-color-primary-500)'}
						strokeWidth="1"
					/>
				</svg>
			</button>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Appearance', 'surecart')}>
					<RangeControl
						label={__('Star Size', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={16}
						max={48}
					/>
				</PanelBody>
			</InspectorControls>
			<ColorInspectorControl
				settings={[
					{
						colorValue: fill_color,
						label: __('Star Color', 'surecart'),
						onColorChange: (color) =>
							setAttributes({ fill_color: color }),
						resetAllFilter: () =>
							setAttributes({ fill_color: undefined }),
					},
				]}
				panelId={clientId}
			/>
			<div {...blockProps}>
				{label && (
					<RichText
						tagName="label"
						className="sc-form-label"
						aria-label={__('Label', 'surecart')}
						placeholder={__('Review Content', 'surecart')}
						value={
							label ??
							__('How would you rate this product?', 'surecart')
						}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				)}

				<div className="stars-container">{stars}</div>
			</div>
			<input type="hidden" name="rating" value={selectedRating} />
		</>
	);
}
