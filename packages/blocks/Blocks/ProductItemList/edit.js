/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	Notice,
	ToolbarGroup,
	Disabled,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';

import EditLayoutConfig from './modules/EditLayoutConfig';
import { ScProductItemList } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import {
	getColorPresetCssVar,
	getFontSizePresetCssVar,
	getSpacingPresetCssVar,
} from '../../util';
import { PRODUCT_ITEM_LAYOUT } from '../ProductItem/edit';

export default ({ attributes, setAttributes, clientId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [layoutConfig, setLayoutConfig] = useState(null);
	const { columns, limit, pagination_alignment, style } = attributes;
	const blockProps = useBlockProps();

	function togglePreview() {
		setIsEditing((flag) => !flag);
	}

	const block = useSelect((select) =>
		select(blockEditorStore)
			.getBlocks(clientId)
			.find((block) => block?.name === 'surecart/product-item')
	);

	const productBlockAttr = block?.attributes;

	const getVars = (prefix, attributes) => {
		let vars = {};
		const spacing = attributes?.style?.spacing;
		const border = attributes?.style?.border;
		const typography = attributes?.style?.typography;
		const color = attributes?.style?.color;

		if (attributes?.fontSize || typography?.fontSize) {
			vars[`--sc-product-${prefix}-font-size`] = attributes?.fontSize
				? getFontSizePresetCssVar(attributes?.fontSize)
				: typography?.fontSize;
		}
		if (attributes?.textColor || color?.text) {
			vars[`--sc-product-${prefix}-text-color`] = attributes?.textColor
				? getColorPresetCssVar(attributes?.textColor)
				: color?.text;
		}
		if (spacing?.padding) {
			['top', 'bottom', 'left', 'right'].forEach((dir) => {
				vars[`--sc-product-${prefix}-padding-${dir}`] =
					getSpacingPresetCssVar(spacing.padding[dir]);
			});
		}
		if (spacing?.margin) {
			['top', 'bottom', 'left', 'right'].forEach((dir) => {
				vars[`--sc-product-${prefix}-margin-${dir}`] =
					getSpacingPresetCssVar(spacing.margin[dir]);
			});
		}
		if (attributes?.borderColor)
			vars[`--sc-product-${prefix}-border-color`] = getColorPresetCssVar(
				attributes?.borderColor
			);
		if (border?.radius)
			vars[`--sc-product-${prefix}-border-radius`] = border?.radius;
		if (border?.width)
			vars[`--sc-product-${prefix}-border-width`] = border?.width;
		if (attributes?.ratio)
			vars[`--sc-product-${prefix}-aspect-ratio`] = attributes?.ratio;
		if (attributes?.align)
			vars[`--sc-product-${prefix}-align`] = attributes?.align;
		if (typography?.fontWeight)
			vars[`--sc-product-${prefix}-font-weight`] = typography?.fontWeight;

		return vars;
	};

	const getConfigStyles = (config) => {
		let styles = {};
		for (let i = 0; i < config.length; i++) {
			const layout = config[i];

			switch (layout.blockName) {
				case 'surecart/product-item-title':
					styles = {
						...styles,
						...getVars('title', layout.attributes),
					};
					break;

				case 'surecart/product-item-image':
					styles = {
						...styles,
						...getVars('image', layout.attributes),
					};
					break;

				case 'surecart/product-item-price':
					styles = {
						...styles,
						...getVars('price', layout.attributes),
					};
					break;
				default:
					break;
			}
		}
		return styles;
	};

	useEffect(() => {
		const layoutConfig =
			block?.innerBlocks.map((item) => ({
				blockName: item?.name,
				attributes: item?.attributes,
			})) ??
			PRODUCT_ITEM_LAYOUT.map((item) => ({
				blockName: item[0],
				attributes: item[1],
			}));
		setLayoutConfig(layoutConfig);
	}, [block]);

	return (
		<Fragment>
			<BlockControls>
				<ToolbarGroup
					controls={[
						{
							icon: 'edit',
							title: __(
								'Edit the layout of each product',
								'surecart'
							),
							onClick: togglePreview,
							isActive: isEditing,
						},
					]}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<RangeControl
						label={__('Columns', 'surecart')}
						value={columns}
						onChange={(columns) => setAttributes({ columns })}
						min={1}
						max={10}
					/>
					{columns > 6 && (
						<Notice
							status="warning"
							isDismissible={false}
							css={css`
								margin-bottom: 20px;
							`}
						>
							{__(
								'This column count exceeds the recommended amount and may cause visual breakage.'
							)}
						</Notice>
					)}
					<RangeControl
						label="Per page limit"
						value={limit}
						onChange={(limit) => setAttributes({ limit })}
						step={5}
						min={5}
						max={40}
					/>
					<ToggleGroupControl
						label={__('Pagination Alignment', 'surecart')}
						value={pagination_alignment}
						onChange={(align) =>
							setAttributes({ pagination_alignment: align })
						}
					>
						<ToggleGroupControlOption
							value="left"
							label={__('Left', 'surecart')}
						/>
						<ToggleGroupControlOption
							value="center"
							label={__('Center', 'surecart')}
						/>
						<ToggleGroupControlOption
							value="right"
							label={__('Right', 'surecart')}
						/>
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div
					css={css`
						display: ${isEditing ? 'block' : 'none'};
					`}
				>
					<EditLayoutConfig
						attributes={attributes}
						onDone={togglePreview}
					/>
				</div>
				<div
					css={css`
						padding: 0.88rem;
						display: ${!isEditing ? 'block' : 'none'};
					`}
				>
					<Disabled>
						{layoutConfig && (
							<ScProductItemList
								style={{
									'border-style': 'none',
									'--sc-product-item-list-column': columns,
									'--sc-product-item-list-gap':
										getSpacingPresetCssVar(
											style?.spacing?.blockGap
										) || '40px',
									...getVars('item', productBlockAttr),
									...getConfigStyles(layoutConfig),
								}}
								layoutConfig={layoutConfig}
								paginationAlignment={pagination_alignment}
							></ScProductItemList>
						)}
					</Disabled>
				</div>
			</div>
		</Fragment>
	);
};
