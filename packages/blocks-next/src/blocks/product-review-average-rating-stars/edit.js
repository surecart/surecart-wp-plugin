/**
 * WordPress dependencies.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';
import { getSpacingPresetCssVar } from '../../../../blocks/util';
import ScIcon from '../../components/ScIcon';

export default ({ attributes, setAttributes, clientId }) => {
	const { fill_color, size, style } = attributes;

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
						className="sc-star-svg"
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
					className="sc-star-svg"
					strokeWidth="2"
				/>
			</div>
		</>
	);
};
