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
import { Fragment, useState } from '@wordpress/element';

import EditModal from './components/EditModal';
import { renderNoProductsPlaceholder } from './utils';

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
					{columns > 6 && (
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

	return (
		<Fragment>
			{getBlockControls()}
			{getInspectorControls()}
			<div {...blockProps}>
				{isEditing ? (
					<EditModal attributes={attributes} />
				) : (
					<Disabled>{renderNoProductsPlaceholder()}</Disabled>
				)}
			</div>
		</Fragment>
	);
};
