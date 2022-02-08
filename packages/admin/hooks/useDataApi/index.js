import { useReducer } from '@wordpress/element';
import dataFetchReducer from './reducer';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export default (initialData) => {
	// state and reducer.
	const [state, dispatch] = useReducer(dataFetchReducer, {
		isLoading: false,
		error: '',
		total: 1,
		total_pages: 10,
		data: initialData,
	});

	const setData = (data) => {
		dispatch({ type: 'SET_DATA', payload: data });
	};

	// update data item by id.
	const updateDataItem = (data) => {
		dispatch({ type: 'UPDATE_DATA_ITEM', payload: data });
	};

	const fetchData = async (args) => {
		dispatch({ type: 'FETCH_INIT' });

		try {
			const { query, path, ...rest } = args;

			const result = await apiFetch({
				path: addQueryArgs(path, query),
				parse: false,
				...rest,
			});

			const payload = await result.json();

			dispatch({
				type: 'FETCH_SUCCESS',
				payload,
				pagination: {
					total: result.headers.get('X-WP-Total'),
					total_pages: result.headers.get('X-WP-TotalPages'),
				},
			});
		} catch (error) {
			console.error(error);
			dispatch({
				type: 'FETCH_FAILURE',
				payload:
					error?.message ||
					__('Something went wrong.', 'checkout_engine'),
			});
		}
	};

	return { ...state, fetchData, setData, updateDataItem };
};
