import { ScProductDonationCustomAmount } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

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
				style={{ width: '100%' }}
				productId={product_id}
			/>
		</div>
	);
};
