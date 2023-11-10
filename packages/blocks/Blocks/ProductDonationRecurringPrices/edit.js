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
	RichText,
} from '@wordpress/block-editor';
import SelectModel from '../../../admin/components/SelectModel';

import {
	ScProductDonationChoices,
	ScButton,
	ScIcon,
	ScRecurringPriceChoiceContainer,
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

export default ({ attributes, setAttributes, context }) => {
	const { label, recurring } = attributes;
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const blockProps = useBlockProps({
		css: css`
			sc-product-donation-choices.wp-block {
				margin: 0;
			}
		`,
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
				</PanelBody>
			</InspectorControls>

			<ScProductDonationChoices
				recurring={recurring}
				productId={context['surecart/product-donation/product_id']}
				{...blockProps}
			>
				<RichText
					aria-label={__('Price Selector Text', 'surecart')}
					value={label}
					onChange={(value) => setAttributes({ label: value })}
					allowedFormats={[]}
					withoutInteractiveFormatting
				/>
			</ScProductDonationChoices>
		</>
	);
};
