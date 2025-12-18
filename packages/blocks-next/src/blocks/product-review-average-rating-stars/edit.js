/**
 * WordPress dependencies.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';
import { getSpacingPresetCssVar } from '../../../../blocks/util';
import ScIcon from '../../components/ScIcon';

export default ({ attributes, setAttributes, clientId }) => {
	const { fill_color, size, style, link_to_reviews, show_for_zero_reviews } =
		attributes;

	const blockProps = useBlockProps({
		style: {
			gap: getSpacingPresetCssVar(style?.spacing?.blockGap),
		},
	});

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
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Link to reviews', 'surecart')}
						help={__(
							'Toggle on to link to the reviews section.',
							'surecart'
						)}
						onChange={(link_to_reviews) =>
							setAttributes({ link_to_reviews })
						}
						checked={link_to_reviews}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show for zero reviews', 'surecart')}
						help={__(
							'Toggle on to show the average rating even if there are zero reviews.',
							'surecart'
						)}
						onChange={(show_for_zero_reviews) =>
							setAttributes({ show_for_zero_reviews })
						}
						checked={show_for_zero_reviews}
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
				{[1, 2, 3, 4].map((starIndex) => (
					<ScIcon
						key={starIndex}
						name="star"
						width={size}
						height={size}
						fill={fill_color || 'var(--sc-color-primary-500)'}
						stroke={fill_color || 'var(--sc-color-primary-500)'}
						className="sc-star-row__label__svg"
						strokeWidth="2"
					/>
				))}
				<ScIcon
					name="half-star"
					width={size}
					height={size}
					fill={fill_color || 'var(--sc-color-primary-500)'}
					stroke={fill_color || 'var(--sc-color-primary-500)'}
					color={fill_color || 'var(--sc-color-primary-500)'}
					className="sc-star-row__label__svg"
					strokeWidth="2"
				/>
			</div>
		</>
	);
};
