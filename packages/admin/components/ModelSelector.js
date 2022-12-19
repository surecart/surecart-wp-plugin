import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import SelectModel from './SelectModel';

export default (props) => {
	const { name, requestQuery = {}, display } = props;
	const [query, setQuery] = useState(null);
	const [choices, setChoices] = useState([]);
	const [pagination, setPagination] = useState({
		enabled: true,
		page: 1,
		per_page: 10,
	});

	const { items, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				name,
				{
					query,
					page: pagination.page,
					per_page: pagination.per_page,
					...requestQuery,
				},
			];
			console.log('fetching....');
			return {
				items: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query, pagination]
	);

	console.log('choices', choices);

	const handleOnScrollEnd = () => {
		if (!pagination.enabled) return;
		setPagination((state) => ({ ...state, page: (state.page += 1) }));
	};

	useEffect(() => {
		if (loading && items?.length < pagination.per_page)
			setPagination((state) => ({ ...state, enabled: false }));

		setChoices((state) => [
			...state,
			...(items || []).map((item) => ({
				label: !!display ? display(item) : item.name,
				value: item.id,
			})),
		]);
	}, [items]);

	return (
		<SelectModel
			choices={choices}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			onScrollEnd={handleOnScrollEnd}
			{...props}
		/>
	);
};
