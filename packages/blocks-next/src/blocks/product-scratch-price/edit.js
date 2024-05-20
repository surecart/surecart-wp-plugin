import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ context: { 'surecart/productId': productId } }) => {
	const blockProps = useBlockProps({
		className: 'product-price',
	});

	const product = useSelect(
		(select) => {
			if (!productId) {
				return null;
			}
			return select(coreStore).getEntityRecord(
				'surecart',
				'product',
				productId
			);
		},
		[productId]
	);

	return (
		<div {...blockProps}>
			{product?.id ? product?.scratch_display_amount : '$10'}
		</div>
	);
};
