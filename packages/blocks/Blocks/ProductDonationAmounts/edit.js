/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	TextControl,
	__experimentalNumberControl as NumberControl,
	Placeholder,
	RangeControl,
} from '@wordpress/components';
import { productDonationStore } from '@surecart/components';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	BlockControls,
	AlignmentControl,
} from '@wordpress/block-editor';
import SelectModel from '../../../admin/components/SelectModel';

import {
	ScProductDonationChoices,
	ScButton,
	ScIcon,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import classNames from 'classnames';

const TEMPLATE = [
	['surecart/product-donation-amount', { amount: 100, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 200, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 500, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 1000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 2000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 5000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 10000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 20000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 50000, currency: 'USD' }],
	['surecart/custom-donation-amount', { currency: 'USD' }],
];

export default ({ attributes, setAttributes }) => {
	const { label, columns, textAlign } = attributes;
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const blockProps = useBlockProps({
		className: classNames({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
		style: {
			'--columns': columns,
		},
		css: css`
			sc-choices::part(label) {
				text-align: left;
			}
			sc-choice.wp-block {
				margin: 0;
			}
		`,
	});

	const { children, innerBlocksProps } = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			'surecart/product-donation-amounts',
			'surecart/product-donation-prices',
		],
		renderAppender: false,
		orientation: columns > 1 ? 'horizontal' : 'vertical',
		template: TEMPLATE,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<RangeControl
						__nextHasNoMarginBottom
						label={__('Columns')}
						value={columns}
						onChange={(columns) => setAttributes({ columns })}
						min={1}
						max={Math.max(6, columns)}
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
			<BlockControls group="block">
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>
			<div
				class="sc-product-donation-choices"
				{...innerBlocksProps}
				{...blockProps}
			>
				<sc-choices label={label}>{children}</sc-choices>
			</div>
		</>
	);
};
