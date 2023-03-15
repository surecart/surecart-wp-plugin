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
import { ScPriceChoices } from '@surecart/components-react';

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

	const blockProps = useBlockProps({
		label,
		type,
		columns,
		css: css`
			sc-choices::part(choices) {
				grid-template-columns: repeat(1, 1fr);
			}
			.block-list-appender {
				position: relative;
			}
		`,
	});

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
			className: 'sc-choices',
			allowedBlocks: ['surecart/price-choice'],
			orientation: columns > 1 ? 'horizontal' : 'vertical',
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
									label: __('Select one', 'checkout_egine'),
									value: 'radio',
								},
								{
									label: __('Select many', 'surecart'),
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

			<ScPriceChoices {...blockProps}>
				<div {...innerBlocksProps}></div>
			</ScPriceChoices>
		</Fragment>
	);
};
