import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, dispatch, select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store } from '../store/data';

export default (name, id = null) => {
	// local states.
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState();

	// select data from core store.
	const model = useSelect((select) => select(store).selectModel(name, id));

	const getEditLink = (id) => {
		if (!id) return false;
		return select(store).getEntityEditLink(name, id);
	};

	const getRelation = (relation) => {
		return select(store).selectRelation(name, id, relation);
	};

	const fetchEntity = async ({ query, ...rest }) => {
		setIsLoading(true);

		const args = select(store).prepareFetchRequest(name, { id, ...query });

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
		} catch (e) {
			console.error(e);
			setError(
				error?.message || __('Something went wrong.', 'checkout_engine')
			);
		} finally {
			setIsLoading(false);
		}
	};

	const updateEntity = (payload) => {
		dispatch(store).receiveModels({ id, ...payload });
	};

	return {
		model,
		isLoading,
		error,
		updateEntity,
		getEditLink,
		getRelation,
		fetchEntity,
	};
};
