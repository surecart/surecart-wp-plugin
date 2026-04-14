import { useState, useMemo, useEffect } from '@wordpress/element';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { ScMenuItem, ScDivider } from '@surecart/components-react';
import SelectModel from './SelectModel';

export default ({
	name,
	kind = 'surecart',
	open = false,
	requestQuery,
	renderChoices,
	display,
	onSelect,
	exclude,
	value,
	prefix,
	...props
}) => {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const per_page = 10;

	// Fetch the selected record so we can show its name in the trigger
	// and pin it at the top of the dropdown (even if it's on page 2+).
	const { selectedRecord, isLoadingSelectedRecord } = useSelect(
		(select) => {
			if (!value) {
				return { selectedRecord: null, isLoadingSelectedRecord: false };
			}
			const queryArgs = [kind, name, value];
			return {
				selectedRecord: select(coreStore).getEntityRecord(...queryArgs),
				isLoadingSelectedRecord: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[value, kind, name]
	);

	// Build query arguments
	const queryArgs = useMemo(
		() => ({
			query: query || undefined,
			page,
			per_page,
			...requestQuery,
			context: 'edit',
		}),
		[query, page, requestQuery]
	);

	// Use useEntityRecords hook
	const { records, isResolving, totalPages } = useEntityRecords(
		kind,
		name,
		queryArgs
	);

	// Accumulate products for pagination (only when not searching)
	const [accumulatedRecords, setAccumulatedRecords] = useState([]);

	// Reset accumulated products when query changes
	useEffect(() => {
		if (query) {
			setAccumulatedRecords([]);
			setPage(1);
		}
	}, [query]);

	// Update accumulated products when new data arrives
	useEffect(() => {
		if (!records) return;

		if (query) {
			// When searching, show only current results
			setAccumulatedRecords(records);
		} else {
			// When not searching, accumulate results for pagination
			if (page === 1) {
				setAccumulatedRecords(records);
			} else {
				setAccumulatedRecords((prev) => {
					const combined = [...prev, ...records];
					// Remove duplicates based on product id
					const seenIds = new Set();
					return combined.filter((product) => {
						if (!product?.id || seenIds.has(product.id))
							return false;
						seenIds.add(product.id);
						return true;
					});
				});
			}
		}
	}, [records, query, page]);

	const handleOnScrollEnd = () => {
		// Don't paginate when searching or if already loading or no more pages
		if (query || isResolving || !totalPages || page >= totalPages) return;
		setPage((prev) => prev + 1);
	};

	const handleQuery = (newQuery) => {
		setQuery(newQuery);
		setPage(1);
	};

	const handleFetch = () => {
		setQuery('');
		setPage(1);
	};

	const renderSelectedPrefix = () => {
		if (!selectedRecord || isLoadingSelectedRecord) return null;
		const label = display ? display(selectedRecord) : selectedRecord.name;
		return (
			<>
				<ScMenuItem checked={true} value={selectedRecord.id}>
					{label}
				</ScMenuItem>
				<ScDivider style={{ '--spacing': 'var(--sc-spacing-x-small)' }} />
			</>
		);
	};

	const triggerLabel = selectedRecord
		? display
			? display(selectedRecord)
			: selectedRecord.name
		: null;

	const internalPrefix = renderSelectedPrefix();
	const combinedPrefix =
		internalPrefix || prefix ? (
			<>
				{internalPrefix}
				{prefix}
			</>
		) : null;

	const getChoices = () => {
		let choices = [...(accumulatedRecords || [])];

		// Filter out the selected record (it's shown in the pinned prefix).
		if (selectedRecord) {
			choices = choices.filter((item) => item.id !== value);
		}

		if (renderChoices) {
			return renderChoices(choices);
		}

		return choices.map((item) => ({
			label: !!display ? display(item) : item.name,
			value: item.id,
			disabled: exclude?.includes(item.id) || false,
		}));
	};

	return (
		<SelectModel
			choices={getChoices()}
			onQuery={handleQuery}
			onFetch={handleFetch}
			loading={isResolving}
			onScrollEnd={handleOnScrollEnd}
			onSelect={onSelect}
			value={value}
			prefix={combinedPrefix}
			triggerLabel={triggerLabel}
			{...props}
		/>
	);
};
