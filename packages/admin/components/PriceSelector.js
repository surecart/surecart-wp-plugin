/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useMemo, useEffect } from '@wordpress/element';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { ScMenuLabel, ScMenuItem, ScDivider } from '@surecart/components-react';
import SelectPrice from './SelectPrice';
import { formatNumber } from '../../admin/util';
import { intervalString } from '../util/translations';

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
	exclude,
	...props
}) => {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const per_page = 10;

	// Fetch the selected price for display when it's not in the current page of results.
	const { selectedPrice, isLoadingSelectedPrice } = useSelect(
		(select) => {
			if (!value) {
				return { selectedPrice: null, isLoadingSelectedPrice: false };
			}
			const queryArgs = [
				'surecart',
				'price',
				value,
				{ expand: ['product'] },
			];
			return {
				selectedPrice: select(coreStore).getEntityRecord(...queryArgs),
				isLoadingSelectedPrice: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[value]
	);

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

	// Render the selected price as a pinned prefix item at the top of the dropdown.
	const renderSelectedPricePrefix = () => {
		if (!selectedPrice || isLoadingSelectedPrice) {
			return null;
		}

		return (
			<>
				<ScMenuLabel>
					{selectedPrice?.product?.name ||
						__('Selected Price', 'surecart')}
				</ScMenuLabel>
				<ScMenuItem checked={true} value={selectedPrice.id}>
					{formatNumber(selectedPrice.amount, selectedPrice.currency)}
					<div slot="suffix">
						{intervalString(selectedPrice, { showOnce: true })}
					</div>
				</ScMenuItem>
				<ScDivider
					style={{ '--spacing': 'var(--sc-spacing-x-small)' }}
				/>
			</>
		);
	};

	// Build trigger label from selected price.
	const triggerLabel = selectedPrice
		? [
				selectedPrice?.product?.name,
				selectedPrice?.display_amount ||
					formatNumber(
						selectedPrice.amount,
						selectedPrice.currency
					),
				intervalString(selectedPrice, { showOnce: true }).trim(),
		  ]
				.filter(Boolean)
				.join(' \u2014 ')
		: null;

	// Internal prefix always hides during search. Consumer prefix respects hidePrefixOnSearch.
	const internalPrefix = query ? null : renderSelectedPricePrefix();
	const displayPrefix = hidePrefixOnSearch && query ? null : prefix;
	const combinedPrefix =
		internalPrefix || displayPrefix ? (
			<>
				{internalPrefix}
				{displayPrefix}
			</>
		) : null;

	// Merge internal exclude (selected price) with consumer-provided exclude.
	const internalExclude = selectedPrice ? [value] : [];
	const consumerExclude = exclude || [];
	const combinedExclude = [...internalExclude, ...consumerExclude];

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
			prefix={combinedPrefix}
			triggerLabel={triggerLabel}
			exclude={combinedExclude}
			{...props}
		/>
	);
};
