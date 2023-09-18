/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ScProductItemPrice } from '@surecart/components-react';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useRef } from 'react';
import { useEffect } from 'react';

export const DEMO_PRICES = [
	{
		id: 'da12c72c-bbbf-4b70-baba-f5a92c54e556',
		amount: 4900,
		currency: 'usd',
	},
	{
		id: 'd32ffacb-8222-43ca-9386-955b4f9848b3',
		amount: 3900,
		currency: 'usd',
	},
	{
		id: 'f46f809c-b63f-4a58-9c84-c5df7e6dcd8b',
		amount: 2900,
		currency: 'usd',
	},
];

export default ({ attributes, setAttributes }) => {
	const { align, range } = attributes;
	const price = useRef(null);
	const blockProps = useBlockProps();

	useEffect(() => {
		if (!price.current) return;
		price.current.prices = DEMO_PRICES;
	}, [price]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Options', 'surecart')}>
					<ToggleControl
						label={__('Price Range', 'surecart')}
						help={__(
							'Show a range of prices if multiple prices are available or has variable products.',
							'surecart'
						)}
						checked={range}
						onChange={(range) => setAttributes({ range })}
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<AlignmentToolbar
					value={align}
					onChange={(align) => setAttributes({ align })}
				/>
			</BlockControls>
			<div {...blockProps}>
				<ScProductItemPrice
					ref={price}
					style={{ '--sc-product-price-align': align }}
					prices={DEMO_PRICES}
					range={range}
				/>
			</div>
		</>
	);
};
