import useSWR from 'swr';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import SelectModel from '../../components/SelectModel';
import { useState } from 'react';

const fetcher = (args) => apiFetch(args);

export default ({ onSelect }) => {
	const [loading, setLoading] = useState(false);

	const { data, error, mutate } = useSWR(
		{
			path: addQueryArgs('checkout-engine/v1/products', {
				context: 'edit',
				recurring: true,
				expand: ['prices', 'product_group'],
			}),
		},
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);

	const onQuery = async (query) => {
		try {
			setLoading(true);
			const response = await apiFetch({
				path: addQueryArgs('checkout-engine/v1/products', {
					context: 'edit',
					query,
					recurring: true,
					expand: ['prices', 'product_group'],
				}),
			});
			mutate([...data, ...response]);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SelectModel
			placeholder={__('Add Another Product', 'SURECART')}
			position={'bottom-left'}
			choices={(data || []).map((product) => ({
				label: product.name,
				value: product.id,
			}))}
			loading={(!error && !data) || loading}
			onSelect={onSelect}
			onQuery={onQuery}
		/>
	);
};
