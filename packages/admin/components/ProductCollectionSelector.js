/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import SelectModel from './SelectModel';

export default (props) => {
	const [query, setQuery] = useState(null);

	const { collections, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product_collection',
				{
					query,
				},
			];
			return {
				collections: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	console.log('collections', collections);

	return (
		<SelectModel
			choices={(collections || []).map((collection) => ({
				label: collection.name,
				value: collection.id,
			}))}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			{...props}
		/>
	);
};
