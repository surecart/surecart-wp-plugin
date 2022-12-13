import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import SelectModel from './SelectModel';

export default (props) => {
	const [query, setQuery] = useState(null);

	const { groups, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product_group',
				{
					query,
				},
			];
			return {
				groups: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	return (
		<SelectModel
			choices={(groups || []).map((group) => ({
				label: group.name,
				value: group.id,
			}))}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			{...props}
		/>
	);
};
