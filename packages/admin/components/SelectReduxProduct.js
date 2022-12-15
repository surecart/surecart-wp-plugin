import { __ } from '@wordpress/i18n';
import { ScSelect } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';
import throttle from 'lodash/throttle';
import { useSelect } from '@wordpress/data';

export default (props) => {
	const { onSelect, ...rest } = props;
	const [query, setQuery] = useState('');
	const [pagination, setPagination] = useState({
		enabled: true,
		page: 1,
		per_page: 20,
	});
	const [products, setProducts] = useState([]);

	const findProduct = throttle(
		(value) => {
			setQuery(value);
		},
		750,
		{ leading: false }
	);

	const { data, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					context: 'edit',
					query,
					expand: ['prices'],
					page: pagination.page,
					per_page: pagination.per_page,
				},
			];
			return {
				data: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query, pagination]
	);

	const handleOnScrollEnd = () => {
		if (!pagination.enabled) return;
		setPagination((state) => ({ ...state, page: (state.page += 1) }));
	};

	useEffect(() => {
		if (loading && data?.length < pagination.per_page)
			setPagination((state) => ({ ...state, enabled: false }));

		setProducts((state) => [
			...state,
			...(data || []).map((product) => ({
				label: product?.name,
				value: product.id,
			})),
		]);
	}, [data]);

	return (
		<ScSelect
			loading={loading}
			placeholder={__('Select a product', 'surecart')}
			searchPlaceholder={__('Search for a product...', 'surecart')}
			search
			// onScOpen={() => findProduct()}
			onScSearch={(e) => findProduct(e.detail)}
			onScChange={(e) => {
				onSelect(e.target.value);
			}}
			onScScrollEnd={handleOnScrollEnd}
			choices={products}
			{...rest}
		/>
	);
};
