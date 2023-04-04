/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ScProductItemPrice } from '@surecart/components-react';

export const priceList = [
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
		amount: 2999,
		currency: 'usd',
	},
];

export default ({ attributes, setAttributes }) => {
	const { align } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={align}
					onChange={(value) => setAttributes({ align: value })}
				/>
			</BlockControls>
			<div {...blockProps}>
				<ScProductItemPrice
					style={{ '--sc-product-price-align': align }}
					prices={priceList}
				/>
			</div>
		</>
	);
};
