/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';
import ScIcon from '../../components/ScIcon';
import UnitSpacingControl from '../../components/UnitSpacingControl';

export default function ({ attributes, setAttributes, clientId }) {
	const {
		columns,
		row_gap,
		column_gap,
		size,
		fill_color,
		bar_fill_color,
		bar_background_color,
	} = attributes;

	const blockProps = useBlockProps({
		style: {
			...(row_gap ? { '--sc-row-gap': row_gap } : {}),
			...(column_gap ? { '--sc-column-gap': column_gap } : {}),
			...(fill_color
				? {
						'--sc-star-fill-color': fill_color,
						'--sc-star-stroke-color': fill_color,
				  }
				: {}),
			...(size ? { '--sc-star-size': size } : {}),
			...(bar_background_color
				? { '--sc-star-bar-background-color': bar_background_color }
				: {}),
		},
	});

	// Placeholder values for editor preview.
	const totalReviews = 9;
	const reviewsBreakdown = { 5: 6, 4: 2, 3: 1, 2: 0, 1: 0 };

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Columns', 'surecart')}
						value={columns}
						onChange={(value) => setAttributes({ columns: value })}
						min={1}
						max={3}
						step={1}
						help={__(
							'Choose the number of columns to display the review breakdown. Keep in mind the mumber of columns may shrink if the width is too narrow.',
							'surecart'
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={() => size !== undefined}
					label={__('Star size', 'surecart')}
					onDeselect={() => setAttributes({ size: undefined })}
					resetAllFilter={() => setAttributes({ size: undefined })}
					isShownByDefault
					panelId={clientId}
				>
					<UnitSpacingControl
						label={__('Star size', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={8}
						max={64}
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={() => row_gap !== undefined}
					label={__('Row gap', 'surecart')}
					onDeselect={() => setAttributes({ row_gap: undefined })}
					resetAllFilter={() => setAttributes({ row_gap: undefined })}
					isShownByDefault
					panelId={clientId}
				>
					<UnitSpacingControl
						label={__('Row gap', 'surecart')}
						value={row_gap}
						onChange={(value) => setAttributes({ row_gap: value })}
						min={0}
						max={50}
					/>
				</ToolsPanelItem>
				{columns > 1 && (
					<ToolsPanelItem
						hasValue={() => column_gap !== undefined}
						label={__('Column gap', 'surecart')}
						onDeselect={() =>
							setAttributes({ column_gap: undefined })
						}
						resetAllFilter={() =>
							setAttributes({ column_gap: undefined })
						}
						isShownByDefault
						panelId={clientId}
					>
						<UnitSpacingControl
							label={__('Column gap', 'surecart')}
							value={column_gap}
							onChange={(value) =>
								setAttributes({ column_gap: value })
							}
							min={0}
							max={100}
						/>
					</ToolsPanelItem>
				)}
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
				>
					{[5, 4, 3, 2, 1].map((star) => {
						const count = reviewsBreakdown[star] || 0;
						const percentage =
							totalReviews > 0 ? (count / totalReviews) * 100 : 0;

						return (
							<div className="sc-star-row" key={star}>
								<span className="sc-star-text">{star}</span>

								<ScIcon
									name="star"
									width="100%"
									height="100%"
									className="sc-star-icon"
									fill="var(--sc-star-fill-color)"
									stroke="var(--sc-star-stroke-color)"
								/>

								<div className="sc-star-row__bar">
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
