import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import { renderNoProductsPlaceholder, renderProductLayout } from '../utils';
import { useInnerBlockLayoutContext } from '../../../context/inner-block-layout-context';

function ProductListContainer({ attributes }) {
	const [products, setProducts] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { layoutConfig } = attributes;
	const { parentName } = useInnerBlockLayoutContext();

	async function fetchProducts() {
		try {
			setIsLoading(true);
			const products = await apiFetch({
				path: addQueryArgs('surecart/v1/products'),
			});
			setProducts(products);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchProducts();
	}, []);

	console.log('attributes', attributes);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{products?.length ? (
				<ul>
					{products.map((product) => {
						console.log(parentName, product, layoutConfig);
						return (
							<li>
								{renderProductLayout(
									parentName,
									product,
									layoutConfig
								)}
							</li>
						);
					})}
				</ul>
			) : (
				renderNoProductsPlaceholder()
			)}
		</div>
	);
}

export default ProductListContainer;
