/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import SelectPrice from './SelectPrice';

export default ({ onSelect, ad_hoc, value, open = false }) => {
	const [query, setQuery] = useState(null);
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pagination, setPagination] = useState({
		enabled: true,
		page: 1,
		per_page: 10,
	});
	const { receiveEntityRecords } = useDispatch(coreStore);

	const handleOnScrollEnd = () => {
		if (!pagination.enabled || isLoading) return;
		setPagination((state) => ({ ...state, page: (state.page += 1) }));
	};

	const fetchData = async (pagination) => {
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'product'
		);
		if (!baseURL) return;
		if (pagination.page === 1) {
			setProducts([]);
			setPagination((state) => ({ ...state, enabled: true }));
		}

		const queryArgs = {
			query,
			expand: ['prices'],
			page: pagination.page,
			per_page: pagination.per_page,
		};

		const data = select(coreStore).getEntityRecords('surecart', 'product', {
			...queryArgs,
		});

		if (data && data.length) {
			setProducts((state) => [...state, ...(data || [])]);
			return;
		}

		try {
			setIsLoading(true);
			const data = await apiFetch({
				path: addQueryArgs(baseURL, queryArgs),
			});
			setProducts((state) => [...state, ...(data || [])]);
			receiveEntityRecords('surecart', 'product', data, queryArgs);
		} catch (error) {
			setPagination((state) => ({ ...state, enabled: false }));
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (query === null) return;
		setPagination((state) => ({ ...state, page: 1 }));
	}, [query]);

	useEffect(() => {
		if (query === null || isLoading) return;
		fetchData(pagination);
	}, [pagination]);

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
			loading={isLoading}
			onSelect={onSelect}
			onScrollEnd={handleOnScrollEnd}
		/>
	);
};
