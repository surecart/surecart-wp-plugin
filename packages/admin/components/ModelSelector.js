import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import SelectModel from './SelectModel';

export default (props) => {
	const { name, requestQuery = {}, display } = props;
	const [query, setQuery] = useState(null);

	const { items, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				name,
				{
					search: query,
					...requestQuery,
				},
			];
			return {
				items: select(coreStore).getEntityRecords(...queryArgs),
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
			choices={(items || []).map((item) => ({
				label: !!display ? display(item) : item.name,
				value: item.id,
			}))}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			{...props}
		/>
	);
};
