import {
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { Spinner, Placeholder } from '@wordpress/components';

export default ({ context: { 'surecart/product-list/id': productId } }) => {
	const blockProps = useBlockProps();

	const { product, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				productId,
				{
					expand: [
						'prices',
						'featured_product_media',
						'product_media.media',
					],
				},
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
			<h3 {...blockProps}>{product?.name || "Product Name"}</h3>
		</>
	);
};
