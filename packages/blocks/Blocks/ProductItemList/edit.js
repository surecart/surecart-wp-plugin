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
	PanelRow,
	ToggleControl,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';

import EditLayoutConfig from './modules/EditLayoutConfig';
import {
	ScFormControl,
	ScProductItemList,
	ScSelect,
	ScButton,
} from '@surecart/components-react';

import {
	getColorPresetCssVar,
	getFontSizePresetCssVar,
	getSpacingPresetCssVar,
} from '../../util';
import { PRODUCT_ITEM_LAYOUT } from '../ProductItem/edit';
import ModelSelector from '../../../admin/components/ModelSelector';
import ProductTag from './components/ProductTag';

const UnitControl = __stableUnitControl
	? __stableUnitControl
	: __experimentalUnitControl;

export default ({ attributes, setAttributes, clientId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [layoutConfig, setLayoutConfig] = useState(null);
	const {
		columns,
		limit,
		pagination_alignment,
		style,
		type,
		sort_enabled,
		search_enabled,
		collection_enabled,
		pagination_enabled,
		ajax_pagination,
		pagination_auto_scroll,
		pagination_size,
		ids,
	} = attributes;

	const apiTokenConnected = scData?.is_account_connected;

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
		if (attributes?.backgroundColor || color?.background) {
			vars[`--sc-product-${prefix}-background-color`] =
				attributes?.backgroundColor
					? getColorPresetCssVar(attributes?.backgroundColor)
					: color?.background;
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

	const getDummyProducts = (limit = 15) => {
		const dummyProducts = [];

		for (let i = 1; i <= limit; i++) {
			const product = {
				permalink: '#',
				name: __('Example Product Title', 'surecart'),
				created_at: Math.floor(Math.random() * 40) + 1,
				prices: {
					data: [
						{
							amount: 1900,
							currency: 'USD',
						},
					],
				},
			};

			dummyProducts.push(product);
		}

		return dummyProducts;
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

	useEffect(() => {
		if (ids.length) {
			setAttributes({ type: 'custom' });
		}
	}, [ids]);

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
						label={
							pagination_enabled
								? __('Products Per Page', 'surecart')
								: __('Limit', 'surecart')
						}
						value={limit}
						onChange={(limit) => setAttributes({ limit })}
						step={1}
						min={1}
						max={40}
					/>
					<PanelRow>
						<ToggleControl
							label={__('Paginate', 'surecart')}
							checked={pagination_enabled}
							onChange={(pagination_enabled) =>
								setAttributes({ pagination_enabled })
							}
						/>
					</PanelRow>
					{pagination_enabled && (
						<>
							<PanelRow>
								<ToggleControl
									label={__('Ajax Pagination', 'surecart')}
									checked={ajax_pagination}
									onChange={(ajax_pagination) =>
										setAttributes({ ajax_pagination })
									}
								/>
							</PanelRow>

							{ajax_pagination && (
								<PanelRow>
									<ToggleControl
										label={__(
											'Scroll Into View',
											'surecart'
										)}
										help={__(
											'When paginating with ajax, scroll to the top of this block.',
											'surecart'
										)}
										checked={pagination_auto_scroll}
										onChange={(pagination_auto_scroll) =>
											setAttributes({
												pagination_auto_scroll,
											})
										}
									/>
								</PanelRow>
							)}
						</>
					)}
					<PanelRow>
						<ToggleControl
							label={__('Sort', 'surecart')}
							help={__(
								'Allow the user to sort by newest, alphabetical and more.',
								'surecart'
							)}
							checked={sort_enabled}
							onChange={(sort_enabled) =>
								setAttributes({ sort_enabled })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Search', 'surecart')}
							help={__('Show a search box.', 'surecart')}
							checked={search_enabled}
							onChange={(search_enabled) =>
								setAttributes({ search_enabled })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Collection', 'surecart')}
							help={__('Show collection filtering.', 'surecart')}
							checked={collection_enabled}
							onChange={(collection_enabled) =>
								setAttributes({ collection_enabled })
							}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody>
					<PanelRow>
						<UnitControl
							label={__('Pagination Font Size', 'surecart')}
							onChange={(pagination_size) =>
								setAttributes({ pagination_size })
							}
							value={pagination_size}
							help={__(
								'This controls the font size of the pagination.',
								'surecart'
							)}
							units={[
								{ value: 'px', label: 'px', default: 14 },
								{ value: 'em', label: 'em', default: 1 },
							]}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Products', 'surecart')}>
					<div
						css={css`
							display: grid;
							gap: 1em;
						`}
					>
						<ScSelect
							label={__('Products To Show', 'surecart')}
							value={type}
							onScChange={(e) => {
								setAttributes({
									type: e.target.value,
								});
								if (
									ids?.length &&
									('all' === e.target.value ||
										'featured' === e.target.value)
								) {
									setAttributes({ ids: [] });
								}
							}}
							choices={[
								{
									value: 'all',
									label: __('All Products', 'surecart'),
								},
								{
									value: 'featured',
									label: __('Featured Products', 'surecart'),
								},
								{
									value: 'custom',
									label: __('Hand Pick Products', 'surecart'),
								},
							]}
						/>

						{type === 'custom' && (
							<ScFormControl
								label={__('Hand Pick Products', 'surecart')}
							>
								{!!ids?.length && (
									<div
										css={css`
											display: flex;
											flex-wrap: wrap;
											gap: 0.5em;
											margin-bottom: 1em;
										`}
									>
										{(ids || []).map((id) => (
											<ProductTag
												key={id}
												id={id}
												onClear={() =>
													setAttributes({
														ids: (ids || []).filter(
															(product_id) =>
																product_id !==
																id
														),
													})
												}
											/>
										))}
									</div>
								)}
								<ModelSelector
									name="product"
									placeholder={__(
										'Select specific products...',
										'surecart'
									)}
									placement={'top-end'}
									requestQuery={{
										archived: false,
										status: ['published'],
									}}
									exclude={ids}
									onSelect={(product) => {
										setAttributes({
											ids: [
												...new Set([
													...(ids || []),
													product,
												]),
											],
										});
									}}
								/>
							</ScFormControl>
						)}
					</div>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{!apiTokenConnected && (
					<Notice
						status="warning"
						isDismissible={false}
						css={css`
							margin-bottom: 20px;
						`}
					>
						<div
							css={css`
								display: ${!apiTokenConnected
									? 'flex'
									: 'none'};
								flex-direction: column;
								gap: 1em;
							`}
						>
							{__(
								'These are sample products. Setup a new store / Connect existing to have real items.',
								'surecart'
							)}
							<ScButton
								type="primary"
								href={window.scData?.getting_started_url}
								css={css`
									width: fit-content;
								`}
							>
								{__('Setup Store', 'surecart')}
							</ScButton>
						</div>
					</Notice>
				)}
				<div
					css={css`
						display: ${isEditing ? 'block' : 'none'};
					`}
				>
					<EditLayoutConfig
						label={__('All Products', 'surecart')}
						description={__(
							'Display all products from your store as a grid.',
							'surecart'
						)}
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
									borderStyle: 'none',
									'--sc-product-item-list-column': columns,
									'--sc-pagination-font-size':
										pagination_size,
									'--sc-product-item-list-gap':
										getSpacingPresetCssVar(
											style?.spacing?.blockGap
										) || '40px',
									...getVars('item', productBlockAttr),
									...getConfigStyles(layoutConfig),
								}}
								ids={type === 'custom' && ids}
								limit={limit}
								layoutConfig={layoutConfig}
								paginationAlignment={pagination_alignment}
								sortEnabled={
									apiTokenConnected ? sort_enabled : false
								}
								featured={type === 'featured'}
								searchEnabled={
									apiTokenConnected ? search_enabled : false
								}
								paginationEnabled={
									apiTokenConnected
										? pagination_enabled
										: false
								}
								{...(!apiTokenConnected ? { products: getDummyProducts(limit) } : {})}
								collectionEnabled={collection_enabled}
							/>
						)}
					</Disabled>
				</div>
			</div>
		</Fragment>
	);
};
