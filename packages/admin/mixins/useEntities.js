import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, dispatch, select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store } from '../store/data';

export default (name) => {
	// local states.
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState();
	const [pagination, setPagination] = useState({
		total: 0,
		total_pages: 0,
	});

	// select data from core store.
	const data = useSelect((select) => select(store).selectCollection(name));

	const getEditLink = (id) => {
		if (!id) return false;
		return select(store).getEntityEditLink(name, id);
	};

	const { setModel } = useDispatch(store);

	const fetchEntities = async ({ query, ...rest }) => {
		setIsLoading(true);

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
		}
	};

	return {
		data,
		isLoading,
		pagination,
		error,
		getEditLink,
		fetchEntities,
		setModel,
	};
};
