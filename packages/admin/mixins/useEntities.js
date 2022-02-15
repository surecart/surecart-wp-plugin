import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, dispatch, select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store } from '../store/data';
import { useEffect } from 'react';

export default (name, args, deps = []) => {
	// local states.
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState();
	const [isFetching, setIsFetching] = useState();
	const [pagination, setPagination] = useState({
		total: 0,
		total_pages: 0,
	});

	// select data from core store.
	const data = useSelect((select) => select(store).selectCollection(name));
	const drafts = useSelect((select) => select(store).selectDrafts(name));

	deps.length &&
		useEffect(() => {
			console.log(deps);
			fetchEntities(args);
		}, deps);

	const fetchEntities = async ({ query, ...rest }) => {
		data?.length && query?.page > 1
			? setIsFetching(true)
			: setIsLoading(true);

		const args = select(store).prepareFetchRequest(name, query);

		try {
			const result = await apiFetch({
				...args,
				...rest,
				parse: false,
			});

			const payload = await result.json();
			if (payload) {
				dispatch(store).receiveModels(payload);
			}

			setPagination({
				total: result.headers.get('X-WP-Total'),
				total_pages: result.headers.get('X-WP-TotalPages'),
			});
		} catch (e) {
			console.error(e);
			setError(
				error?.message || __('Something went wrong.', 'checkout_engine')
			);
		} finally {
			setIsLoading(false);
			setIsFetching(false);
		}
	};

	const addEntity = (payload) => {
		dispatch(store).addDraft(name, payload);
	};

	const snakeToCamel = (str) =>
		str
			.toLowerCase()
			.replace(/([-_][a-z])/g, (group) =>
				group.toUpperCase().replace('-', '').replace('_', '')
			);
	const camelName = snakeToCamel(name);
	const ucName =
		camelName.charAt(0).toUpperCase() + camelName.toLowerCase().slice(1);

	return {
		isLoading,
		isFetching,
		pagination,
		error,
		[`${name}s`]: data,
		[`draft${ucName}s`]: drafts,
		[`fetch${ucName}s`]: fetchEntities,
		[`add${ucName}`]: addEntity,
	};
};
