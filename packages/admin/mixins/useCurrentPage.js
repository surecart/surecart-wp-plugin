import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, dispatch, select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store } from '../store/data';

export default (name = '', query) => {
	// local states.
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState();

	const id = useSelect((select) => select(store).selectPageId());
	const model = useSelect(
		(select) => select(store).selectModelById(name, id),
		[id]
	);

	const fetchModel = async (query) => {
		if (!name) return;
		setIsLoading(true);
		const args = select(store).prepareFetchRequest(name, { id, ...query });
		try {
			const result = await apiFetch({
				...args,
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

	return { id, model, isLoading, error, fetchModel };
};
