import useSWR from 'swr';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const fetcher = (path) => apiFetch({ path });

export default ({ id, query }) => {
	const { data, error, mutate } = useSWR(
		addQueryArgs(`surecart/v1/products/${id}`, {
			context: 'edit',
			query,
			recurring: true,
			expand: ['prices', 'product_group'],
		}),
		fetcher
	);

	return {
		products: data || [],
		mutate,
		isLoading: !error && !data,
		error,
	};
};
