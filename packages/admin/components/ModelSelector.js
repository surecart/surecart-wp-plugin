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

	const { data, loading } = useSelect(
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
			return {
				data:
					query !== null
						? select(coreStore).getEntityRecords(...queryArgs)
						: [],
				loading:
					query !== null
						? select(coreStore).isResolving(
								'getEntityRecords',
								queryArgs
						  )
						: false,
			};
		},
		[query, pagination]
	);

	const handleOnScrollEnd = () => {
		if (!pagination.enabled || loading) return;
		setPagination((state) => ({ ...state, page: (state.page += 1) }));
	};

	const handleOnQuery = (val) => {
		if (query === val) return;
		setQuery(val);
		setChoices([]);
		if (pagination.page !== 1)
			setPagination((state) => ({ ...state, page: 1 }));
	};

	useEffect(() => {
		if (loading && data?.length < pagination.per_page)
			setPagination((state) => ({ ...state, enabled: false }));

		setChoices((state) => [
			...state,
			...(data || []).map((item) => ({
				label: !!display ? display(item) : item.name,
				value: item.id,
			})),
		]);
	}, [data]);

	return (
		<SelectModel
			choices={choices}
			onQuery={handleOnQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			onScrollEnd={handleOnScrollEnd}
			{...props}
		/>
	);
};
