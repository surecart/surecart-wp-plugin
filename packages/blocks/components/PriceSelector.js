/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import usePrevious from '../hooks/usePrevious';

import SelectPrice from './SelectPrice';

export default ({
	onSelect,
	ad_hoc,
	variable,
	value,
	requestQuery,
	required,
	...props
}) => {
	const [query, setQuery] = useState(null);
	const [products, setProducts] = useState([]);
	const [totalPages, setTotalPages] = useState();
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const previousQuery = usePrevious(query);

	const handleOnChangeQuery = (queryValue) => setQuery(queryValue);

	const handleOnScrollEnd = () => {
		if (page >= totalPages || isLoading) return;
		setPage(page + 1);
	};

	const fetchData = async () => {
		if (isLoading) return;

		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'product'
		);

		if (!baseURL) return;

		const queryArgs = {
			query,
			expand: ['prices', 'variants'],
			page,
			per_page: perPage,
			...requestQuery,
		};

		try {
			setIsLoading(true);

			// fetch.
			const response = await apiFetch({
				path: addQueryArgs(baseURL, queryArgs),
				parse: false,
			});

			// set pagination.
			setTotalPages(parseInt(response.headers.get('X-WP-TotalPages')));

			// get response.
			const data = await response.json();

			// append new data to choices.
			for (let i = 0; i < data.length; i++) {
				if (!products.some((item) => item.id === data[i].id)) {
					setProducts((state) => [...state, data[i]]);
				}
			}

			receiveEntityRecords('surecart', 'product', products, queryArgs);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	// if the page, perPage changes, fetch data.
	useEffect(() => {
		// we are doing a new query, reset pagination to 1.
		if (query !== previousQuery) {
			setPage(1);
			return; // we want to fetch data on the next useEffect.
		}
		fetchData();
	}, [page, perPage, query]);

	// if the query changes, reset the page to 1.
	useEffect(() => {
		if (page === 1) {
			setProducts([]);
		}
	}, [page]);

	return (
		<SelectPrice
			required={required}
			css={css`
				flex: 0 1 50%;
			`}
			value={value}
			ad_hoc={ad_hoc}
			variable={variable}
			products={products}
			onQuery={handleOnChangeQuery}
			onFetch={fetchData}
			loading={isLoading}
			onSelect={onSelect}
			onScrollEnd={handleOnScrollEnd}
			{...props}
		/>
	);
};
