import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import SelectModel from './SelectModel';

export default (props) => {
	const {
		name,
		requestQuery = {},
		display,
		exclude = [],
		fetchOnLoad = false,
	} = props;
	const [query, setQuery] = useState(null);
	const [models, setModels] = useState([]);
	const [totalPages, setTotalPages] = useState();
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);

	const handleOnScrollEnd = () => {
		if (page >= totalPages || isLoading) return;
		setPage(page + 1);
	};

	const fetchData = async () => {
		const { baseURL } = select(coreStore).getEntityConfig('surecart', name);
		if (!baseURL) return;

		const queryArgs = {
			query,
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
				if (!models.some((item) => item.id === data[i].id)) {
					setModels((state) => [...state, data[i]]);
				}
			}

			// add to redux for other page items
			receiveEntityRecords('surecart', name, models, queryArgs);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	// if the query changes, reset the page to 1.
	useEffect(() => {
		if (query === null) return;
		setPage(1);
	}, [query]);

	useEffect(() => {
		if (!fetchOnLoad) return;
		fetchData();
	}, [fetchOnLoad]);

	// if the page, perPage changes, fetch data.
	useEffect(() => {
		if (query === null || isLoading) return;
		fetchData();
	}, [page, perPage, query]);

	// if the query changes, reset the page to 1.
	useEffect(() => {
		if (page === 1) {
			setModels([]);
		}
	}, [page]);

	return (
		<SelectModel
			choices={(models || []).map((item) => ({
				label: !!display ? display(item) : item.name,
				value: item.id,
				disabled: exclude.includes(item.id),
			}))}
			onQuery={setQuery}
			onFetch={fetchData}
			loading={isLoading}
			onScrollEnd={handleOnScrollEnd}
			{...props}
		/>
	);
};
