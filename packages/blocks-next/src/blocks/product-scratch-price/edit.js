import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

export default ({ context: { postId } }) => {
	const blockProps = useBlockProps({
		className: 'product-price',
	});

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	return <div {...blockProps}>{product?.scratch_display_amount}</div>;
};
