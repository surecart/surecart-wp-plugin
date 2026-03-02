/**
 * WordPress dependencies.
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';
import ScIcon from '../../components/ScIcon';
import UnitSpacingControl from '../../components/UnitSpacingControl';
import { getSpacingPresetCssVar } from '../../../../blocks/util';

export default ({ attributes, setAttributes, clientId }) => {
	const { fill_color, size, style } = attributes;

	const blockProps = useBlockProps({
		style: {
			gap: getSpacingPresetCssVar(style?.spacing?.blockGap),
		},
	});

	return (
		<>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={() => size !== undefined}
					label={__('Size', 'surecart')}
					onDeselect={() => setAttributes({ size: undefined })}
					resetAllFilter={() => setAttributes({ size: undefined })}
					isShownByDefault
					panelId={clientId}
				>
					<UnitSpacingControl
						label={__('Size', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={10}
						max={100}
					/>
				</ToolsPanelItem>
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
					name="star"
					width={size}
					height={size}
					fill="none"
					stroke={fill_color || 'var(--sc-color-primary-500)'}
					color={fill_color || 'var(--sc-color-primary-500)'}
					className="sc-star-row__label__svg"
					strokeWidth="2"
				/>
			</div>
		</>
	);
};
