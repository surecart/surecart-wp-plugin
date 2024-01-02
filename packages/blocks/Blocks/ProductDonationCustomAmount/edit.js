/** @jsx jsx */
import { ScProductDonationCustomAmount } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';

export default ({ context }) => {
	const { 'surecart/product-donation/product_id': product_id } = context; // get product_id context from parent.

	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			width: '100%',
		},
	});

	return (
		<div {...blockProps}>
			<ScProductDonationCustomAmount
				css={css`
					width: 100%;
				`}
				productId={product_id}
			/>
		</div>
	);
};
