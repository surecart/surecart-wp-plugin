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
} from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';

import EditLayoutConfig from './modules/EditLayoutConfig';
import { ScProductItemList } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { getSpacingPresetCssVar } from '../../util';
import { PRODUCT_ITEM_LAYOUT } from '../ProductItem/edit';

export default ({ attributes, setAttributes, clientId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const { columns, gap } = attributes;
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
	const layoutConfig =
		block?.innerBlocks.map((item) => ({
			blockName: item?.name,
			attributes: item?.attributes,
		})) ??
		PRODUCT_ITEM_LAYOUT.map((item) => ({
			blockName: item[0],
			attributes: item[1],
		}));

	console.log(block, layoutConfig);

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
					{columns > 5 && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'This column count exceeds the recommended amount and may cause visual breakage.'
							)}
						</Notice>
					)}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{isEditing ? (
					<EditLayoutConfig
						attributes={attributes}
						onDone={togglePreview}
					/>
				) : (
					<div
						css={css`
							padding: 0.88rem;
						`}
					>
						<ScProductItemList
							style={{
								'--sc-product-item-list-column': columns,
								'--sc-product-item-list-gap': gap,
								'--sc-product-item-padding-top':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing
											?.padding?.top ?? '0.88rem'
									),
								'--sc-product-item-padding-bottom':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing
											?.padding?.bottom ?? '0.88rem'
									),
								'--sc-product-item-padding-left':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing
											?.padding?.left ?? '0.88rem'
									),
								'--sc-product-item-padding-right':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing
											?.padding?.right ?? '0.88rem'
									),
								'--sc-product-item-margin-top':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing?.margin
											?.top ?? '0'
									),
								'--sc-product-item-margin-bottom':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing?.margin
											?.bottom ?? '0'
									),
								'--sc-product-item-margin-left':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing?.margin
											?.left ?? '0'
									),
								'--sc-product-item-margin-right':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing?.margin
											?.right ?? '0'
									),
								'--sc-product-item-border-color':
									getSpacingPresetCssVar(
										`var(--${productBlockAttr?.borderColor})` ??
											'--wp--preset--color--cyan-bluish-gray'
									),
								'--sc-product-item-border-width':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.border
											?.width ?? '1px'
									),
								'--sc-product-item-border-radius':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.border
											?.radius ?? '4px'
									),
							}}
							layoutConfig={layoutConfig}
						></ScProductItemList>
					</div>
				)}
			</div>
		</Fragment>
	);
};
