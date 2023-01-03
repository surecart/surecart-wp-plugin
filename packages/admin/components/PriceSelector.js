/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { useState, useEffect } from '@wordpress/element';
import SelectPrice from './SelectPrice';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ onSelect, ad_hoc, value, open = false }) => {
	const [query, setQuery] = useState(null);
	const [products, setProducts] = useState([]);
	const [searchedProducts, setSearchedProducts] = useState(null);
	const [pagination, setPagination] = useState({
		enabled: true,
		page: 1,
		per_page: 10,
	});

	const { data, loading, error, is_searched } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					query,
					expand: ['prices'],
					page: pagination.page,
					per_page: pagination.per_page,
				},
			];
			return {
				data:
					query !== null
						? select(coreStore).getEntityRecords(...queryArgs)
						: [],
				loading:
					query !== null
						? select(coreStore).isResolving(
								'getEntityRecords',
								queryArgs
						  )
						: false,
				error:
					select(coreStore)?.getResolutionError(
						'getEntityRecords',
						queryArgs
					) ?? null,
				is_searched: !!query?.length,
			};
		},
		[query, pagination]
	);

	const handleOnScrollEnd = () => {
		if (!pagination.enabled || loading) return;
		setPagination((state) => ({ ...state, page: (state.page += 1) }));
	};

	const handleOnQuery = (val) => {
		if (query === val) return;
		if (val === '') setProducts([]);
		if (pagination.page !== 1 || val === '')
			setPagination((state) => ({ ...state, page: 1, enabled: true }));

		setSearchedProducts([]);
		setQuery(val);
	};

	useEffect(() => {
		if (error) setPagination((state) => ({ ...state, enabled: false }));
		if (!loading) return;

		if (is_searched) {
			setSearchedProducts((state) => [...state, ...(data || [])]);
		} else {
			setProducts((state) => [...state, ...(data || [])]);
		}
	}, [data, error, loading, is_searched]);

	return (
		<SelectPrice
			required
			css={css`
				flex: 0 1 50%;
			`}
			value={value}
			ad_hoc={ad_hoc}
			open={open}
			choices={is_searched ? searchedProducts : products}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			onSelect={onSelect}
			onScrollEnd={handleOnScrollEnd}
		/>
	);
};
