import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import Product from './Product';
import { useDispatch } from '@wordpress/data';
import SelectModel from '../../components/SelectModel';
import { useEffect, useState } from 'react';
import { store } from '../../store/data';
import useEntities from '../../mixins/useEntities';

export default ({ id, products, loading }) => {
	const [query, setQuery] = useState(null);
	const { updateModel } = useDispatch(store);
	const {
		products: productsQuery,
		fetchProducts,
		isLoading,
	} = useEntities('product');

	useEffect(() => {
		fetchProducts({
			query: {
				query,
				recurring: true,
				expand: ['prices'],
			},
		});
	}, [query]);

	const onSelect = (product_id) => {
		updateModel('product', product_id, { product_group: id });
	};

	const groupProducts = products.filter((p) => p.product_group === id);

	return (
		<Box
			title={__('Products', 'surecart')}
			loading={loading}
			footer={
				<div>
					<SelectModel
						placeholder={__('Add Another Product', 'surecart')}
						position={'bottom-left'}
						choices={productsQuery.map((product) => ({
							label: product.name,
							value: product.id,
						}))}
						loading={isLoading}
						onSelect={onSelect}
						onQuery={setQuery}
					/>
				</div>
			}
		>
			{!!groupProducts?.length ? (
				groupProducts
					.filter((p) => p.product_group === id)
					.map((product) => (
						<Product key={product?.id} product={product} />
					))
			) : (
				<sc-empty icon="shopping-bag">
					{__('Add some products to this upgrade group.', 'surecart')}
				</sc-empty>
			)}
		</Box>
	);
};
