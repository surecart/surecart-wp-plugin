import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import Product from './Product';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import NewProduct from './NewProduct';
import { ScBlockUi } from '@surecart/components-react';

export default ({ id }) => {
	const { products, updating, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					context: 'edit',
					product_group_ids: [id],
					expand: ['prices'],
					per_page: 100,
				},
			];
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			const products = (
				select(coreStore).getEntityRecords(...queryArgs) || []
			).filter((p) => p.product_group === id);
			return {
				products,
				loading: loading && !products?.length,
				updating: loading && products?.length,
			};
		},
		[id]
	);

	return (
		<Box
			title={__('Products', 'surecart')}
			loading={loading}
			footer={<NewProduct id={id} />}
		>
			{!!products?.length ? (
				products.map((product) => (
					<Product key={product?.id} product={product} />
				))
			) : (
				<sc-empty icon="shopping-bag">
					{__(
						'Add some products to this upgrade group. A customer who has purchased one of these products can switch between others in this group.',
						'surecart'
					)}
				</sc-empty>
			)}
			{updating && <ScBlockUi spinner />}
		</Box>
	);
};
