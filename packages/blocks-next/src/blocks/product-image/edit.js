import {
	useBlockProps,
	InspectorControls,
	useSettings,
} from '@wordpress/block-editor';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	PanelBody,
	SelectControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

export default ({
	attributes: { sizing, aspectRatio, height, width },
	context: { 'surecart/productId': productId },
	setAttributes,
	clientId,
}) => {
	const [availableUnits] = useSettings('spacing.units');
	const units = useCustomUnits({
		availableUnits: availableUnits || ['px', '%', 'vw', 'em', 'rem'],
	});
	const classes = classnames({
		'product-img': true,
		is_contained: sizing === 'contain',
		is_covered: sizing === 'cover',
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
	const product = useSelect(
		(select) => {
			if (!productId) {
				return null;
			}
			return select(coreStore).getEntityRecord(
				'surecart',
				'product',
				productId
			);
		},
		[productId]
	);

	const alt = product?.featured_media?.alt || '';
	const title = product?.featured_media?.title || '';

	return (
		<>
			<InspectorControls>
				<PanelBody>
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
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<img
					src={product?.featured_media?.src}
					alt={alt}
					{...(title ? { title } : {})}
				/>
			</div>
		</>
	);
};
