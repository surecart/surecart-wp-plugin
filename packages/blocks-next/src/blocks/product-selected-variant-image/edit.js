/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	InspectorControls,
	useSettings,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';
import {
	SelectControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

/**
 * External dependencies.
 */
import classnames from 'classnames';

export default ({
	attributes: { sizing, aspectRatio, height, width },
	context: { postId },
	setAttributes,
	clientId,
}) => {
	const [availableUnits] = useSettings('spacing.units');
	const units = useCustomUnits({
		availableUnits: availableUnits || ['px', '%', 'vw', 'em', 'rem'],
	});
	const classes = classnames({
		'product-img': true,
		'sc-is-contained': sizing === 'contain',
		'sc-is-covered': sizing === 'cover',
	});

	const blockProps = useBlockProps({
		className: classes,
		style: { width, height, aspectRatio },
	});

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

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	return (
		<>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={() => !!sizing}
					label={__('Image Cropping', 'surecart')}
					onDeselect={() => setAttributes({ sizing: undefined })}
					resetAllFilter={() => ({
						sizing: undefined,
					})}
					isShownByDefault
					panelId={clientId}
				>
					<ToggleGroupControl
						label={__('Image Cropping', 'surecart')}
						value={sizing}
						onChange={(value) => setAttributes({ sizing: value })}
					>
						<ToggleGroupControlOption
							value="contain"
							label={__('Contain', 'surecart')}
						/>
						<ToggleGroupControlOption
							value="cover"
							label={__('Cover', 'surecart')}
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={() => !!aspectRatio}
					label={__('Aspect ratio', 'surecart')}
					onDeselect={() => setAttributes({ aspectRatio: undefined })}
					resetAllFilter={() => ({
						aspectRatio: undefined,
					})}
					isShownByDefault
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
				<UnitControl
					label={__('Height', 'surecart')}
					labelPosition="top"
					value={height || ''}
					min={0}
					onChange={(nextHeight) =>
						onDimensionChange('height', nextHeight)
					}
					units={units}
				/>
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
			</InspectorControls>

			<figure {...blockProps}>
				{product?.preview_image?.src ? (
					<img {...product?.preview_image} />
				) : (
					<img
						src={
							window.scData.plugin_url + '/images/placeholder.jpg'
						}
						width="1180"
						height="1180"
					/>
				)}
			</figure>
		</>
	);
};
