import useSWR from 'swr';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const fetcher = (path) => apiFetch({ path });

export default (id) => {
	const { data, error, mutate } = useSWR(
		addQueryArgs(`checkout-engine/v1/products/${id}`, {
			context: 'edit',
			expand: ['prices', 'product_group', 'files'],
		}),
		fetcher
	);

	return {
		product: data,
		mutate,
		isLoading: !error && !data,
		error,
	};
};
