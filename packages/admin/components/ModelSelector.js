/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useMemo, useEffect } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import SelectModel from './SelectModel';

export default ({
	name,
	kind = 'surecart',
	value,
	open = false,
	requestQuery,
	renderChoices,
	display,
	onSelect,
	exclude,
	...props
}) => {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const per_page = 10;

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

	const getChoices = () => {
		let choices = [...(accumulatedRecords || [])];

		if (renderChoices) {
			return renderChoices(choices);
		}

		return choices.map((item) => ({
			label: !!display ? display(item) : item.name,
			value: item.id,
			disabled: exclude.includes(item.id),
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
			{...props}
		/>
	);
};
