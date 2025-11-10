/**
 * WordPress dependencies.
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';
import { getSpacingPresetCssVar } from '../../../../blocks/util';

export default ({ attributes, setAttributes, context, clientId }) => {
	const { review } = context;
	const { fill_color, size, style } = attributes;

	const blockProps = useBlockProps({
		style: {
			gap: getSpacingPresetCssVar(style?.spacing?.blockGap),
		},
	});

	const rating = review?.rating ?? 4;
	const stars = [];

	const wholeStars = Math.floor(rating);
	const hasHalf = wholeStars < rating;

	for (let i = 1; i <= 5; i++) {
		const isFull = i <= wholeStars;
		const isHalf = hasHalf && i === wholeStars + 1;

		const points =
			'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';
		const clipId = `half-clip-${i}`;

		stars.push(
			<svg
				className="sc-star-svg"
				viewBox="0 0 24 24"
				width={size}
				height={size}
			>
				{isHalf ? (
					<>
						<defs>
							<clipPath id={clipId}>
								<rect x="0" y="0" width="12" height="24" />
							</clipPath>
						</defs>
						<polygon
							points={points}
							clipPath={`url(#${clipId})`}
							fill={fill_color || 'var(--sc-color-primary-500)'}
						/>
						<polygon
							points={points}
							fill="none"
							stroke={fill_color || 'var(--sc-color-primary-500)'}
							strokeWidth="2"
						/>
					</>
				) : isFull ? (
					<polygon
						points={points}
						fill={fill_color || 'var(--sc-color-primary-500)'}
						stroke={fill_color || 'var(--sc-color-primary-500)'}
						strokeWidth="2"
					/>
				) : (
					<polygon
						points={points}
						fill="none"
						stroke={fill_color || 'var(--sc-color-primary-500)'}
						strokeWidth="2"
					/>
				)}
			</svg>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Appearance', 'surecart')}>
					<RangeControl
						label={__('Size', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={10}
						max={100}
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
			<div {...blockProps}>{stars}</div>
		</>
	);
};
