import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, dispatch, select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store } from '../store/data';
import { store as uiStore } from '../store/ui';
import { useEffect } from 'react';

export default (name, args, deps = []) => {
	// local states.
	const { addModelErrors } = useDispatch(uiStore);
	const [isLoading, setIsLoading] = useState();
	const [isFetching, setIsFetching] = useState();
	const [pagination, setPagination] = useState({
		total: 0,
		total_pages: 0,
	});

	// select data from core store.
	const data = useSelect((select) =>
		(select(store).selectCollection(name) || []).sort((a, b) => {
			return a?.created_at - b?.created_at;
		})
	);
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
			const error = await e.json();
			console.error(error);
			addModelErrors(name, [error]);
		} finally {
			setIsLoading(false);
			setIsFetching(false);
		}
	};

	const addEntity = (payload) => {
		dispatch(store).addDraft(name, payload);
	};

	const receiveModels = (payload) => dispatch(store).receiveModels(payload);

	// errors.
	const errors = useSelect((select) =>
		select(uiStore).selectModelErrors(name)
	);
	const addErrors = (error) => addModelErrors(name, error);
	const clearErrors = () => clearModelErrors(name);

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
		errors,
		addErrors,
		clearErrors,
		[`${name}s`]: data,
		[`draft${ucName}s`]: drafts,
		[`fetch${ucName}s`]: fetchEntities,
		[`add${ucName}`]: addEntity,
		[`receive${ucName}s`]: receiveModels,
	};
};
