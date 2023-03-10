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
} from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';

import EditLayoutConfig from './modules/EditLayoutConfig';
import { ScProductItemList } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { getSpacingPresetCssVar } from '../../util';
import { PRODUCT_ITEM_LAYOUT } from '../ProductItem/edit';

export default ({ attributes, setAttributes, clientId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [layoutConfig, setLayoutConfig] = useState(null);
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
						<ScProductItemList
							style={{
								'--sc-product-item-list-column': columns,
								'--sc-product-item-list-gap': gap,
								'--sc-product-item-padding-top':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing
											?.padding?.top
									),
								'--sc-product-item-padding-bottom':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing
											?.padding?.bottom
									),
								'--sc-product-item-padding-left':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing
											?.padding?.left
									),
								'--sc-product-item-padding-right':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing
											?.padding?.right
									),
								'--sc-product-item-margin-top':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing?.margin
											?.top
									),
								'--sc-product-item-margin-bottom':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing?.margin
											?.bottom
									),
								'--sc-product-item-margin-left':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing?.margin
											?.left
									),
								'--sc-product-item-margin-right':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.spacing?.margin
											?.right
									),
								'--sc-product-item-border-color':
									getSpacingPresetCssVar(
										productBlockAttr?.borderColor ??
											'--wp--preset--color--cyan-bluish-gray'
									),
								'--sc-product-item-border-width':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.border?.width
									),
								'--sc-product-item-border-radius':
									getSpacingPresetCssVar(
										productBlockAttr?.style?.border?.radius
									),
							}}
							layoutConfig={layoutConfig}
						></ScProductItemList>
					</Disabled>
				</div>
			</div>
		</Fragment>
	);
};
