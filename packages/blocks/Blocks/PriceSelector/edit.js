/** @jsx jsx */

import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	RangeControl,
	RadioControl,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { select, dispatch, useSelect } from '@wordpress/data';

import { css, jsx, Global } from '@emotion/core';
import styles from './editor-styles';

/**
 * Component Dependencies
 */
import { CePriceChoices } from '@surecart/components-react';

export default ({ attributes, setAttributes, clientId, isSelected }) => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const { label, type, columns } = attributes;

	const insertPrice = () => {
		const innerCount =
			select('core/editor').getBlocksByClientId(clientId)[0].innerBlocks
				.length;
		let block = createBlock('surecart/price-choice');
		dispatch('core/block-editor').insertBlock(block, innerCount, clientId);
	};

	const blockProps = useBlockProps();

	const { children, childIsSelected } = useSelect((select) => {
		return {
			children:
				select(blockEditorStore).getBlocksByClientId(clientId)?.[0]
					.innerBlocks,
			childIsSelected: select(blockEditorStore).hasSelectedInnerBlock(
				clientId,
				true
			),
		};
	});

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			className: 'ce-choices',
			allowedBlocks: ['surecart/price-choice'],
			renderAppender:
				isSelected || childIsSelected
					? InnerBlocks.ButtonBlockAppender
					: false,
		}
	);

	// update children when type or children changes.
	useEffect(() => {
		if (!children.length) {
			insertPrice();
		}
		children.forEach(function (child) {
			dispatch(blockEditorStore).updateBlockAttributes(child.clientId, {
				type,
			});
		});
	}, [type, children]);

	return (
		<Fragment>
			<Global styles={styles} />
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<RadioControl
							label={__('Type', 'surecart')}
							help="The type of product selection"
							selected={type}
							options={[
								{
									label: __('Choose one', 'checkout_egine'),
									value: 'radio',
								},
								{
									label: __('Choose many', 'surecart'),
									value: 'checkbox',
								},
							]}
							onChange={(type) => setAttributes({ type })}
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={__('Columns', 'surecart')}
							value={columns}
							onChange={(columns) => setAttributes({ columns })}
							min={1}
							max={3}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<CePriceChoices label={label} type={type} columns={columns}>
					<div {...innerBlocksProps} />
				</CePriceChoices>
			</div>
		</Fragment>
	);
};
