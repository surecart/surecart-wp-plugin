/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';

export default function ({ attributes, setAttributes, clientId }) {
	const { show_for_zero_reviews = true, size = 16, fill_color } = attributes;
	const blockProps = useBlockProps();

	// Placeholder values for editor preview.
	const totalReviews = 9;
	const reviewsBreakdown = { 5: 6, 4: 2, 3: 1, 2: 0, 1: 0 };

	const points =
		'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show for zero reviews', 'surecart')}
						help={__(
							'Toggle off to hide the breakdown when there are no reviews.',
							'surecart'
						)}
						onChange={(value) =>
							setAttributes({ show_for_zero_reviews: value })
						}
						checked={show_for_zero_reviews}
					/>

					<RangeControl
						label={__('Star size', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={8}
						max={64}
					/>
				</PanelBody>
			</InspectorControls>

			<ColorInspectorControl
				settings={[
					{
						colorValue: fill_color,
						label: __('Fill Color', 'surecart'),
						onColorChange: (color) =>
							setAttributes({ fill_color: color }),
						resetAllFilter: () =>
							setAttributes({ fill_color: undefined }),
					},
				]}
				panelId={clientId}
			/>

			<div {...blockProps}>
				<div className="sc-star-bars">
					{[5, 4, 3, 2, 1].map((star) => {
						const count = reviewsBreakdown[star] || 0;
						const percentage =
							totalReviews > 0
								? (count / totalReviews) * 100
								: 0;

						return (
							<div className="sc-star-row" key={star}>
								<div className="sc-star-label">
									<span className="sc-star-text">
										{star}
									</span>
									<span
										className="sc-star-svg"
										style={{
											display: 'inline-block',
											width: `${size}px`,
											height: `${size}px`,
											verticalAlign: 'middle',
											marginLeft: 6,
										}}
									>
										<svg
											viewBox="0 0 24 24"
											width={size}
											height={size}
										>
											<polygon
												points={points}
												fill={
													fill_color ||
													'var(--sc-color-primary-500)'
												}
												stroke={
													fill_color ||
													'var(--sc-color-primary-500)'
												}
												strokeWidth="1"
											/>
										</svg>
									</span>
								</div>

								<div className="sc-bar-wrap">
									<div
										className="sc-bar-fill"
										style={{
											width: `${percentage}%`,
										}}
									/>
								</div>

								<div className="sc-count">{count}</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
