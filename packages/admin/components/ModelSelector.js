import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import SelectModel from './SelectModel';

export default (props) => {
	const { name, requestQuery = {}, display } = props;
	const [query, setQuery] = useState(null);
	const [choices, setChoices] = useState([]);
	const [searchedChoices, setSearchedChoices] = useState(null);
	const [pagination, setPagination] = useState({
		enabled: true,
		page: 1,
		per_page: 10,
	});

	const { data, loading, error, is_searched } = useSelect(
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
				error:
					select(coreStore)?.getResolutionError(
						'getEntityRecords',
						queryArgs
					) ?? null,
				is_searched: !!query?.length,
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
		if (val === '') setChoices([]);
		if (pagination.page !== 1 || val === '')
			setPagination((state) => ({ ...state, page: 1, enabled: true }));

		setSearchedChoices([]);
		setQuery(val);
	};

	const mapData = (data) => {
		return (data || []).map((item) => ({
			label: !!display ? display(item) : item.name,
			value: item.id,
		}));
	};

	useEffect(() => {
		if (error) setPagination((state) => ({ ...state, enabled: false }));
		if (loading) return;

		if (is_searched) {
			setSearchedChoices((state) =>
				pagination.page === 1
					? mapData(data)
					: [...state, ...mapData(data)]
			);
		} else {
			setChoices((state) => [...state, ...mapData(data)]);
		}
	}, [data, error, loading, is_searched]);

	return (
		<SelectModel
			choices={is_searched ? searchedChoices : choices}
			onQuery={handleOnQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			onScrollEnd={handleOnScrollEnd}
			{...props}
		/>
	);
};
