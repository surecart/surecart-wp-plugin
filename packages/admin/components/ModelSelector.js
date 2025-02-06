import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import SelectModel from './SelectModel';

export default (props) => {
	const {
		name,
		kind = 'surecart',
		requestQuery = {},
		display,
		exclude = [],
		onChangeQuery = () => {},
		renderChoices,
		fetchOnLoad = false,
	} = props;
	const [query, setQuery] = useState(null);
	const [models, setModels] = useState([]);
	const [totalPages, setTotalPages] = useState();
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);

	const handleOnChangeQuery = (queryValue) => {
		setQuery(queryValue);
		onChangeQuery(queryValue);
	};

	const handleOnScrollEnd = () => {
		if (page >= totalPages || isLoading) return;
		setPage(page + 1);
	};

	const fetchData = async () => {
		const { baseURL } = select(coreStore).getEntityConfig(kind, name);
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

	// if the page, perPage changes, fetch data.
	useEffect(() => {
		if (query === null || isLoading) return;
		fetchData();
	}, [page, perPage, query]);

	useEffect(() => {
		if (fetchOnLoad) {
			fetchData();
		}
	}, [fetchOnLoad]);

	// if the query changes, reset the page to 1.
	useEffect(() => {
		if (page === 1) {
			setModels([]);
		}
	}, [page]);

	const getChoices = () => {
		let choices = [...(models || [])];

		if (renderChoices) {
			return renderChoices(choices);
		}

		return choices.map((item) => ({
			label: !!display ? display(item) : item.name,
			value: item.id,
			disabled: exclude.includes(item.id),
		}));
	};

	return (
		<SelectModel
			choices={getChoices()}
			onQuery={handleOnChangeQuery}
			onFetch={fetchData}
			loading={isLoading}
			onScrollEnd={handleOnScrollEnd}
			{...props}
		/>
	);
};
