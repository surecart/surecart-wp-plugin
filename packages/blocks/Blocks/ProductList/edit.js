/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ScProducts } from '@surecart/components-react';
import {
	PanelBody,
	RangeControl,
	Notice,
	ToolbarGroup,
	Disabled,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import EditModal from './components/EditModal';

export default ({ attributes, setAttributes }) => {
	const [isEditing, setIsEditing] = useState(false);
	const { columns, rows, gap } = attributes;
	const blockProps = useBlockProps();

	// console.log('attributes', attributes);

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
					{columns > 10 && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'This column count exceeds the recommended amount and may cause visual breakage.'
							)}
						</Notice>
					)}
					<RangeControl
						label={__('Rows', 'surecart')}
						value={rows}
						onChange={(rows) => setAttributes({ rows })}
						min={1}
						max={10}
					/>
					{columns > 10 && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'This row count exceeds the recommended amount and may cause visual breakage.'
							)}
						</Notice>
					)}
				</PanelBody>
			</InspectorControls>
		);
	}

	return (
		<div {...blockProps}>
			{getBlockControls()}
			{getInspectorControls()}
			{isEditing ? (
				<EditModal attributes={attributes} />
			) : (
				<Disabled>
					<ScProducts />
				</Disabled>
			)}
		</div>
	);
};
