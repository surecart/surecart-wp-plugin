/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';
import ScIcon from '../../components/ScIcon';

export default function ({ attributes, setAttributes, clientId }) {
	const {
		show_for_zero_reviews = true,
		columns,
		row_gap,
		column_gap,
		star_label_gap,
		size,
		fill_color,
		bar_fill_color,
		bar_background_color,
	} = attributes;
	const blockProps = useBlockProps();

	// Placeholder values for editor preview.
	const totalReviews = 9;
	const reviewsBreakdown = { 5: 6, 4: 2, 3: 1, 2: 0, 1: 0 };

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

					<SelectControl
						label={__('Columns', 'surecart')}
						value={columns}
						options={[
							{
								label: __('1 Column', 'surecart'),
								value: 1,
							},
							{
								label: __('2 Columns', 'surecart'),
								value: 2,
							},
							{
								label: __('3 Columns', 'surecart'),
								value: 3,
							},
						]}
						onChange={(value) =>
							setAttributes({ columns: parseInt(value) })
						}
						help={__(
							'Choose the number of columns to display the review breakdown. You may need to adjust the row & column gap accordingly.',
							'surecart'
						)}
					/>

					<RangeControl
						label={__('Row gap', 'surecart')}
						value={row_gap}
						onChange={(value) => setAttributes({ row_gap: value })}
						min={0}
						max={50}
						help={__(
							'Adjust the spacing between rows.',
							'surecart'
						)}
					/>

					{columns > 1 && (
						<RangeControl
							label={__('Column gap', 'surecart')}
							value={column_gap}
							onChange={(value) =>
								setAttributes({ column_gap: value })
							}
							min={0}
							max={50}
							help={__(
								'Adjust the spacing between columns.',
								'surecart'
							)}
						/>
					)}

					<RangeControl
						label={__('Star size', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={8}
						max={64}
					/>

					<RangeControl
						label={__('Star and label gap', 'surecart')}
						value={star_label_gap}
						onChange={(value) =>
							setAttributes({ star_label_gap: value })
						}
						min={0}
						max={20}
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
					{
						colorValue: bar_fill_color,
						label: __('Bar Active Color', 'surecart'),
						onColorChange: (color) =>
							setAttributes({ bar_fill_color: color }),
						resetAllFilter: () =>
							setAttributes({ bar_fill_color: undefined }),
					},
					{
						colorValue: bar_background_color,
						label: __('Bar Background Color', 'surecart'),
						onColorChange: (color) =>
							setAttributes({ bar_background_color: color }),
						resetAllFilter: () =>
							setAttributes({ bar_background_color: undefined }),
					},
				]}
				panelId={clientId}
			/>

			<div {...blockProps}>
				<div
					className={`sc-star-bars sc-star-bars__columns-${columns}`}
					style={{
						rowGap: `${row_gap}px`,
						columnGap: `${column_gap}px`,
					}}
				>
					{[5, 4, 3, 2, 1].map((star) => {
						const count = reviewsBreakdown[star] || 0;
						const percentage =
							totalReviews > 0 ? (count / totalReviews) * 100 : 0;

						return (
							<div className="sc-star-row" key={star}>
								<div
									className="sc-star-row__label"
									style={{ gap: `${star_label_gap}px` }}
								>
									<span className="sc-star-text">{star}</span>
									<span className="sc-star-row__label__svg">
										<ScIcon
											name="star"
											width={size}
											height={size}
											fill={
												fill_color ||
												'var(--sc-color-primary-500)'
											}
											stroke={
												fill_color ||
												'var(--sc-color-primary-500)'
											}
											strokeWidth="2"
										/>
									</span>
								</div>

								<div
									className="sc-star-row__bar"
									style={{
										backgroundColor:
											bar_background_color || undefined,
									}}
								>
									<div
										className="sc-star-row__bar-fill"
										style={{
											width: `${percentage}%`,
											backgroundColor:
												bar_fill_color || undefined,
										}}
									/>
								</div>

								<div className="sc-star-row__count">
									{count}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
