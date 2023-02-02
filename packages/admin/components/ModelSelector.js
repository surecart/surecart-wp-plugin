import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import SelectModel from './SelectModel';

export default (props) => {
	const { name, requestQuery = {}, display } = props;
	const [query, setQuery] = useState(null);
	const [choices, setChoices] = useState([]);
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

	const mapData = (data) => {
		return (data || []).map((item) => ({
			label: !!display ? display(item) : item.name,
			value: item.id,
		}));
	};

	const fetchData = async (pagination) => {
		const { baseURL } = select(coreStore).getEntityConfig('surecart', name);
		if (!baseURL) return;
		if (pagination.page === 1) {
			setChoices([]);
			setPagination((state) => ({ ...state, enabled: true }));
		}

		const queryArgs = {
			query,
			page: pagination.page,
			per_page: pagination.per_page,
			...requestQuery,
		};

		const data = select(coreStore).getEntityRecords('surecart', name, {
			...queryArgs,
		});

		if (data && data.length) {
			setChoices((state) => [...state, ...mapData(data)]);
			return;
		}

		try {
			setIsLoading(true);
			const data = await apiFetch({
				path: addQueryArgs(baseURL, queryArgs),
			});
			setChoices((state) => [...state, ...mapData(data)]);
			receiveEntityRecords('surecart', name, data, queryArgs);
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
		<SelectModel
			choices={choices}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={isLoading}
			onScrollEnd={handleOnScrollEnd}
			{...props}
		/>
	);
};
