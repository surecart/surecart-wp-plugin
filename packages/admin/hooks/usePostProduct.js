import { useDispatch, useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

export default () => {
	const { sc_product_id: productId } = useSelect((select) =>
		select(editorStore).getCurrentPostAttribute('meta')
	);

	const { editEntityRecord } = useDispatch(coreStore);
	const editProduct = (data) =>
		editEntityRecord('surecart', 'product', productId, data);

	const { product, loading } = useSelect(
		(select) => {
			if (!productId) return;
			const queryArgs = [
				'surecart',
				'product',
				productId,
				{ context: 'edit', expand: ['price'] },
			];
			return {
				product: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[productId]
	);

	return {
		productId,
		product,
    editProduct,
		loading,
	};
};
