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
	const [pagination, setPagination] = useState({
		enabled: true,
		page: 1,
		per_page: 10,
	});

	const { data, loading } = useSelect(
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

		setProducts((state) => [...state, ...(data || [])]);
	}, [data]);

	return (
		<SelectPrice
			required
			css={css`
				flex: 0 1 50%;
			`}
			value={value}
			ad_hoc={ad_hoc}
			open={open}
			products={products}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			onSelect={onSelect}
			onScrollEnd={handleOnScrollEnd}
		/>
	);
};
