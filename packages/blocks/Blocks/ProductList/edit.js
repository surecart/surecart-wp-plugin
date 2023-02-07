/** @jsx jsx */
import { jsx } from '@emotion/core';
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
	Disabled,
} from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';

import EditLayoutConfig from './modules/EditLayoutConfig';
import { InnerBlockLayoutContextProvider } from '../../context/inner-block-layout-context';
import ProductListContainer from './modules/ProductListContainer';

export default ({ attributes, setAttributes }) => {
	const [isEditing, setIsEditing] = useState(false);
	const { columns, gap } = attributes;
	const blockProps = useBlockProps();

	function togglePreview() {
		setIsEditing((flag) => !flag);
	}

	function getBlockControls() {
		return (
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
		);
	}

	function getInspectorControls() {
		return (
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
		);
	}

	// const containerStyles = {
	// 	display: 'grid',
	// 	gap,
	// 	gridTemplateColumns: `repeat(${columns}, 1fr)`,
	// };
	console.log(attributes);

	return (
		<Fragment>
			{getBlockControls()}
			{getInspectorControls()}
			<div {...blockProps}>
				{isEditing ? (
					<EditLayoutConfig attributes={attributes} />
				) : (
					<Disabled>
						<InnerBlockLayoutContextProvider parentName="surecart/product-list">
							<ProductListContainer attributes={attributes} />
						</InnerBlockLayoutContextProvider>
					</Disabled>
				)}
			</div>
		</Fragment>
	);
};
