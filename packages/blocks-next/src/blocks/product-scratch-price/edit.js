import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

export default ({ context: { 'surecart/productId': productId } }) => {
	const blockProps = useBlockProps({
		className: 'product-price',
	});

	const {
		record: {
			meta: { product },
		},
	} = useEntityRecord('postType', 'sc_product', productId);

	return <div {...blockProps}>{product?.scratch_display_amount}</div>;
};
