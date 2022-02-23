import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	CeButton,
	CeDropdown,
	CeMenu,
} from '@checkout-engine/components-react';
import Product from './Product';
import { useDispatch } from '@wordpress/data';
import SelectModel from '../../components/SelectModel';
import { useEffect, useState } from 'react';
import { store } from '../../store/data';
import useEntities from '../../mixins/useEntities';

export default ({ id, loading }) => {
	const [query, setQuery] = useState(null);
	const { updateModel } = useDispatch(store);
	const { products, fetchProducts, isLoading } = useEntities('product');

	useEffect(() => {
		fetchProducts({
			query: {
				query,
				recurring: true,
				expand: ['prices', 'product_group'],
			},
		});
	}, [query]);

	const onSelect = (product_id) => {
		updateModel('product', product_id, { product_group: id });
	};

	return (
		<Box
			title={__('Products', 'checkout_engine')}
			loading={loading}
			footer={
				<div>
					<SelectModel
						placeholder={__(
							'Add Another Product',
							'checkout_engine'
						)}
						position={'bottom-left'}
						choices={products.map((product) => ({
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
			{(products || [])
				.filter((p) => p.product_group === id)
				.map((product) => (
					<Product key={product?.id} product={product} />
				))}
		</Box>
	);
};
