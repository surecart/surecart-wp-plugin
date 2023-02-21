/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import { ScPriceRange } from '@surecart/components-react';

export const priceList = [
	{
		id: 'da12c72c-bbbf-4b70-baba-f5a92c54e556',
		amount: 49900,
		currency: 'usd',
	},
	{
		id: 'd32ffacb-8222-43ca-9386-955b4f9848b3',
		amount: 39900,
		currency: 'usd',
	},
	{
		id: 'f46f809c-b63f-4a58-9c84-c5df7e6dcd8b',
		amount: 29999,
		currency: 'usd',
	},
];

export default () => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<ScPriceRange prices={priceList} />
		</div>
	);
};
