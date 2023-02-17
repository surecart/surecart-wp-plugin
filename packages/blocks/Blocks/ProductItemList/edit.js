/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
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

export default ({ attributes, setAttributes }) => {
	const [isEditing, setIsEditing] = useState(false);
	const { columns, gap } = attributes;
	const blockProps = useBlockProps();

	function togglePreview() {
		setIsEditing((flag) => !flag);
	}

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
							}}
							layoutConfig={[
								{ blockName: 'surecart/product-item-title' },
								{
									blockName: 'surecart/product-item-image',
									attributes: { sizing: 'cover' },
								},
							]}
						></ScProductItemList>
					</div>
				)}
			</div>
		</Fragment>
	);
};
