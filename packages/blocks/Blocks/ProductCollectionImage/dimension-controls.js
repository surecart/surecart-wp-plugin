/**
 * WordPress dependencies.
 */
import { __, _x } from '@wordpress/i18n';
import {
	SelectControl,
	__experimentalUnitControl as UnitControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { InspectorControls, useSetting } from '@wordpress/block-editor';

const SCALE_OPTIONS = (
	<>
		<ToggleGroupControlOption
			value="cover"
			label={_x(
				'Cover',
				'Scale option for Image dimension control',
				'surecart'
			)}
		/>
		<ToggleGroupControlOption
			value="contain"
			label={_x(
				'Contain',
				'Scale option for Image dimension control',
				'surecart'
			)}
		/>
		<ToggleGroupControlOption
			value="fill"
			label={_x(
				'Fill',
				'Scale option for Image dimension control',
				'surecart'
			)}
		/>
	</>
);

const DEFAULT_SCALE = 'cover';

const scaleHelp = {
	cover: __(
		'Image is scaled and cropped to fill the entire space without being distorted.',
		'surecart'
	),
	contain: __(
		'Image is scaled to fill the space without clipping nor distorting.',
		'surecart'
	),
	fill: __(
		'Image will be stretched and distorted to completely fill the space.',
		'surecart'
	),
};

const DimensionControls = ({
	clientId,
	attributes: { aspectRatio, width, height, scale = DEFAULT_SCALE },
	setAttributes,
}) => {
	// const defaultUnits = ['px', '%', 'vw', 'em', 'rem'];
	// const units = useCustomUnits({
	// 	availableUnits: useSetting('spacing.units') || defaultUnits,
	// });
	const onDimensionChange = (dimension, nextValue) => {
		const parsedValue = parseFloat(nextValue);
		/**
		 * If we have no value set and we change the unit,
		 * we don't want to set the attribute, as it would
		 * end up having the unit as value without any number.
		 */
		if (isNaN(parsedValue) && nextValue) return;
		setAttributes({
			[dimension]: parsedValue < 0 ? '0' : nextValue,
		});
	};
	const scaleLabel = _x('Scale', 'Image scaling options', 'surecart');

	const showScaleControl = height || (aspectRatio && aspectRatio !== 'auto');

	return (
		<InspectorControls group="dimensions">
			<ToolsPanelItem
				hasValue={() => !!aspectRatio}
				label={__('Aspect ratio', 'surecart')}
				onDeselect={() => setAttributes({ aspectRatio: undefined })}
				resetAllFilter={() => ({
					aspectRatio: undefined,
				})}
				isShownByDefault={true}
				panelId={clientId}
			>
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Aspect ratio', 'surecart')}
					value={aspectRatio}
					options={[
						// These should use the same values as AspectRatioDropdown in @wordpress/block-editor
						{
							label: __('Original', 'surecart'),
							value: 'auto',
						},
						{
							label: __('Square', 'surecart'),
							value: '1',
						},
						{
							label: __('16:9', 'surecart'),
							value: '16/9',
						},
						{
							label: __('4:3', 'surecart'),
							value: '4/3',
						},
						{
							label: __('3:2', 'surecart'),
							value: '3/2',
						},
						{
							label: __('9:16', 'surecart'),
							value: '9/16',
						},
						{
							label: __('3:4', 'surecart'),
							value: '3/4',
						},
						{
							label: __('2:3', 'surecart'),
							value: '2/3',
						},
					]}
					onChange={(nextAspectRatio) =>
						setAttributes({ aspectRatio: nextAspectRatio })
					}
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				className="single-column"
				hasValue={() => !!height}
				label={__('Height', 'surecart')}
				onDeselect={() => setAttributes({ height: undefined })}
				resetAllFilter={() => ({
					height: undefined,
				})}
				isShownByDefault={true}
				panelId={clientId}
			>
				<UnitControl
					label={__('Height', 'surecart')}
					labelPosition="top"
					value={height || ''}
					min={0}
					onChange={(nextHeight) =>
						onDimensionChange('height', nextHeight)
					}
					units={['px']}
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				className="single-column"
				hasValue={() => !!width}
				label={__('Width', 'surecart')}
				onDeselect={() => setAttributes({ width: undefined })}
				resetAllFilter={() => ({
					width: undefined,
				})}
				isShownByDefault={true}
				panelId={clientId}
			>
				<UnitControl
					label={__('Width', 'surecart')}
					labelPosition="top"
					value={width || ''}
					min={0}
					onChange={(nextWidth) =>
						onDimensionChange('width', nextWidth)
					}
					units={units}
				/>
			</ToolsPanelItem>
			{showScaleControl && (
				<ToolsPanelItem
					hasValue={() => !!scale && scale !== DEFAULT_SCALE}
					label={scaleLabel}
					onDeselect={() =>
						setAttributes({
							scale: DEFAULT_SCALE,
						})
					}
					resetAllFilter={() => ({
						scale: DEFAULT_SCALE,
					})}
					isShownByDefault={true}
					panelId={clientId}
				>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						label={scaleLabel}
						value={scale}
						help={scaleHelp[scale]}
						onChange={(value) =>
							setAttributes({
								scale: value,
							})
						}
						isBlock
					>
						{SCALE_OPTIONS}
					</ToggleGroupControl>
				</ToolsPanelItem>
			)}
		</InspectorControls>
	);
};

export default DimensionControls;
