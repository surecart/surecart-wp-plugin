import {
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { Spinner, Placeholder } from '@wordpress/components';

export default ({ context: { 'surecart/productId': productId } }) => {
	const blockProps = useBlockProps({
		className: 'product-item-title',
	});

	const { product, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				productId,
			];
			return {
				product: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		}
	);
	
	if (loading) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

	return (
		<>
			<div {...blockProps}>{product?.name || "Product Name"}</div>
		</>
	);
};
