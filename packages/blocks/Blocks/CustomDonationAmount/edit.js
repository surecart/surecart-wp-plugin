/** @jsx jsx */
import { ScCustomDonationAmount } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { jsx } from '@emotion/core';

export default ({ attributes, context }) => {
	const { currency } = attributes;
	const { 'surecart/product-donation/product_id': product_id } = context; // get product_id context from parent.

	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			width: '100%',
		},
	});

	return (
		<div {...blockProps}>
			<ScCustomDonationAmount
				currencyCode={currency}
				productId={product_id}
			/>
		</div>
	);
};
