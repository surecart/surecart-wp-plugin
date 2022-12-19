import { __ } from '@wordpress/i18n';
import { ScSelect } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import throttle from 'lodash/throttle';
import { useSelect } from '@wordpress/data';

export default (props) => {
	const { onSelect, ...rest } = props;
	const [query, setQuery] = useState('');

	const findProduct = throttle(
		(value) => {
			setQuery(value);
		},
		750,
		{ leading: false }
	);

	const { products, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{ context: 'edit', query, expand: ['prices'], per_page: 30 },
			];
			return {
				products: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	return (
		<ScSelect
			loading={loading}
			placeholder={__('Select a product', 'surecart')}
			searchPlaceholder={__('Search for a product...', 'surecart')}
			search
			onScOpen={() => findProduct()}
			onScSearch={(e) => findProduct(e.detail)}
			onScChange={(e) => {
				onSelect(e.target.value);
			}}
			choices={(products || []).map((product) => {
				return {
					label: product?.name,
					value: product.id,
				};
			})}
			{...rest}
		/>
	);
};
