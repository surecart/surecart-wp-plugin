/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useMemo, useEffect } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import SelectPrice from './SelectPrice';

export default ({
	onSelect,
	ad_hoc,
	variable,
	value,
	open = false,
	requestQuery,
	required,
	prefix,
	hidePrefixOnSearch = false,
	...props
}) => {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const per_page = 10;

	// Build query arguments
	const queryArgs = useMemo(
		() => ({
			query: query || undefined,
			expand: ['prices', 'variants'],
			page,
			per_page,
			...requestQuery,
			context: 'edit',
		}),
		[query, page, requestQuery]
	);

	// Use useEntityRecords hook
	const {
		records: fetchedProducts,
		isResolving: loading,
		totalPages,
	} = useEntityRecords('surecart', 'product', queryArgs);

	// Accumulate products for pagination (only when not searching)
	const [accumulatedProducts, setAccumulatedProducts] = useState([]);

	// Reset accumulated products when query changes
	useEffect(() => {
		if (query) {
			setAccumulatedProducts([]);
			setPage(1);
		}
	}, [query]);

	// Update accumulated products when new data arrives
	useEffect(() => {
		if (!fetchedProducts) return;

		if (query) {
			// When searching, show only current results
			setAccumulatedProducts(fetchedProducts);
		} else {
			// When not searching, accumulate results for pagination
			if (page === 1) {
				setAccumulatedProducts(fetchedProducts);
			} else {
				setAccumulatedProducts((prev) => {
					const combined = [...prev, ...fetchedProducts];
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
	}, [fetchedProducts, query, page]);

	const handleOnScrollEnd = () => {
		// Don't paginate when searching or if already loading or no more pages
		if (query || loading || !totalPages || page >= totalPages) return;
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

	// Hide prefix when searching if requested
	const displayPrefix = hidePrefixOnSearch && query ? null : prefix;

	return (
		<SelectPrice
			required={required}
			css={css`
				flex: 0 1 50%;
			`}
			value={value}
			ad_hoc={ad_hoc}
			variable={variable}
			open={open}
			products={accumulatedProducts}
			onQuery={handleQuery}
			onFetch={handleFetch}
			loading={loading}
			onSelect={onSelect}
			onScrollEnd={handleOnScrollEnd}
			prefix={displayPrefix}
			{...props}
		/>
	);
};
