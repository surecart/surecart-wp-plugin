/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Icon } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import {
	DataViewListLayout,
	useDataViewState,
} from '../components/dataview-list';
import './product-list-style.scss';

/**
 * Read initial state from URL query params.
 * Supports: ?sc_collection=xxx (from Product Collections page), ?status=archived
 */
const URL_PARAMS = getQueryArgs(window.location.href);

/**
 * Build initial DataViews filters from URL params.
 * Translates ?sc_collection=xxx and ?status=xxx to native DataViews filters.
 */
const INITIAL_VIEW_FILTERS = (() => {
	const filters = [];
	// Status filter from URL — only add when explicitly set (archived or all).
	// By default (no param), Active is implicit in buildQueryArgs so no chip shows.
	const urlStatus = URL_PARAMS.status;
	if (urlStatus === 'archived' || urlStatus === 'all') {
		filters.push({
			field: 'archive_status',
			operator: 'is',
			value: urlStatus,
		});
	}
	// Collection filter from URL.
	if (URL_PARAMS.sc_collection) {
		filters.push({
			field: 'product_collections',
			operator: 'isAny',
			value: [URL_PARAMS.sc_collection],
		});
	}
	return filters;
})();

/**
 * Status filter options.
 */
const STATUS_ELEMENTS = [
	{ value: 'active', label: __('Active', 'surecart') },
	{ value: 'archived', label: __('Archived', 'surecart') },
	{ value: 'all', label: __('All', 'surecart') },
];

/**
 * Sort field map — mirrors PHP get_sort_map().
 */
const SORT_MAP = {
	name: 'name',
	date: 'cataloged_at',
};

/**
 * Column width styles via DataViews layout.styles API.
 */
const LAYOUT_STYLES = {
	featured: { width: '60px' },
};

/**
 * Default visible fields.
 */
const DEFAULT_FIELDS = [
	'name',
	'price',
	'commission_amount',
	'quantity',
	'product_collections',
	'status',
	'featured',
	'date',
];

/**
 * URL helpers.
 */
function getEditUrl(id) {
	return addQueryArgs('admin.php', {
		page: 'sc-products',
		action: 'edit',
		id,
	});
}

/**
 * Products list DataView component.
 *
 * @param {Object} props
 * @param {Object} props.navigation - SPA navigation from useProductsNavigation.
 */
export default function ProductsList({ navigation }) {
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	// Tracks whether an inline action (archive/unarchive/duplicate) is in-flight.
	// Passed to isLoading so the table shows a loading state during mutations.
	const [isMutating, setIsMutating] = useState(false);

	// Fetch product collections for the DataViews filter dropdown.
	const { records: collectionRecords } = useEntityRecords(
		'surecart',
		'product-collection',
		{ per_page: 100 }
	);
	const collectionElements = useMemo(
		() =>
			(collectionRecords || []).map((c) => ({
				value: c.id,
				label: c.name,
			})),
		[collectionRecords]
	);

	// Reusable data view state hook.
	const {
		view,
		setView,
		records,
		hasResolved,
		paginationInfo,
		invalidateList,
	} = useDataViewState({
		entity: 'product',
		defaultSort: { field: 'date', direction: 'desc' },
		sortMap: SORT_MAP,
		defaultFields: DEFAULT_FIELDS,
		layoutStyles: LAYOUT_STYLES,
		initialViewFilters: INITIAL_VIEW_FILTERS,
		buildQueryArgs: ({ view: currentView }) => {
			const args = {
				// Expand relations needed for the list columns.
				expand: ['product_collections', 'commission_structure'],
			};

			// Status filter (from DataViews native filters).
			// Default: show active (non-archived) products when no filter is set.
			const statusFilter = currentView.filters?.find(
				(f) => f.field === 'archive_status'
			);
			const statusValue = statusFilter?.value;
			if (statusValue === 'archived') {
				args.archived = true;
			} else if (statusValue === 'all') {
				// Show everything — don't set archived param.
			} else {
				// No filter or 'active' → default to active products.
				args.archived = false;
			}

			// Collection filter (from DataViews native filters).
			const collectionFilter = currentView.filters?.find(
				(f) => f.field === 'product_collections'
			);
			if (collectionFilter?.value?.length) {
				args.product_collection_ids = collectionFilter.value;
			}

			return args;
		},
	});

	// ─── Sync state to URL bar ───
	const activeStatusFilter = view.filters?.find(
		(f) => f.field === 'archive_status'
	);
	const activeStatusValue = activeStatusFilter?.value || '';
	const activeCollectionFilter = view.filters?.find(
		(f) => f.field === 'product_collections'
	);
	const activeCollectionId = activeCollectionFilter?.value?.[0] || '';

	useEffect(() => {
		const params = { page: 'sc-products' };

		// Only add status param when explicitly filtering (not the default Active).
		if (activeStatusValue === 'archived' || activeStatusValue === 'all') {
			params.status = activeStatusValue;
		}

		// Collection filter.
		if (activeCollectionId) {
			params.sc_collection = activeCollectionId;
		}

		const url = addQueryArgs('admin.php', params);
		window.history.replaceState(null, '', url);
	}, [activeStatusValue, activeCollectionId]);

	// ─── Field definitions ───
	const fields = useMemo(
		() => [
			// Archive status filter (not a visible column — only drives the filter dropdown).
			{
				id: 'archive_status',
				label: __('Status', 'surecart'),
				enableSorting: false,
				enableHiding: false,
				filterBy: {
					operators: ['is'],
				},
				elements: STATUS_ELEMENTS,
				render: () => null,
			},
			{
				id: 'name',
				label: __('Name', 'surecart'),
				enableSorting: true,
				enableGlobalSearch: true,
				render: ({ item }) => (
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 12px;
						`}
					>
						{item?.line_item_image?.src &&
						item?.line_item_image?.type !== 'fallback' ? (
							<img
								src={item.line_item_image.src}
								alt={item?.name}
								css={css`
									width: 40px;
									height: 40px;
									border: var(--sc-input-border);
									border-radius: var(
										--sc-border-radius-medium
									);
									box-shadow: var(--sc-shadow-small);
									object-fit: cover;
									flex: 0 0 40px;
								`}
							/>
						) : (
							<div
								css={css`
									width: 40px;
									height: 40px;
									background: #f3f3f3;
									display: flex;
									align-items: center;
									justify-content: center;
									border: var(--sc-input-border);
									border-radius: var(
										--sc-border-radius-medium
									);
									box-shadow: var(--sc-shadow-small);
									flex: 0 0 40px;
								`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									style={{ width: '18px', height: '18px' }}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
						)}
						<div>
							<a
								href={getEditUrl(item?.id)}
								onClick={(e) => {
									e.preventDefault();
									navigation.goToEdit(item?.id);
								}}
								css={css`
									font-weight: 600;
									color: var(--sc-color-gray-900);
									text-decoration: none;
									&:hover {
										color: var(--sc-color-primary-500);
									}
								`}
							>
								{item?.name}
							</a>
						</div>
					</div>
				),
			},
			{
				id: 'price',
				label: __('Price', 'surecart'),
				enableSorting: false,
				render: ({ item }) => item?.range_display_amount || '-',
			},
			{
				id: 'commission_amount',
				label: __('Commission', 'surecart'),
				enableSorting: false,
				render: ({ item }) =>
					item?.commission_structure?.commission_amount || '-',
			},
			{
				id: 'quantity',
				label: __('Quantity', 'surecart'),
				enableSorting: false,
				render: ({ item }) => {
					if (!item?.stock_enabled) {
						return '\u221E';
					}
					return sprintf(
						/* translators: %d is the number of available stock */
						__('%d Available', 'surecart'),
						item?.available_stock || 0
					);
				},
			},
			{
				id: 'product_collections',
				label: __('Collections', 'surecart'),
				enableSorting: false,
				filterBy: {
					operators: ['isAny'],
				},
				elements: collectionElements,
				render: ({ item }) => {
					const itemCollections =
						item?.product_collections?.data || [];
					if (!itemCollections.length) {
						return '-';
					}
					return (
						<div
							css={css`
								display: flex;
								flex-wrap: wrap;
								gap: 4px;
							`}
						>
							{itemCollections.map((collection) => (
								<sc-tag key={collection.id} type="info">
									{collection.name}
								</sc-tag>
							))}
						</div>
					);
				},
			},
			{
				id: 'status',
				label: __('Product Page', 'surecart'),
				enableSorting: false,
				render: ({ item }) => {
					const isPublished = item?.status === 'published';
					return (
						<sc-tag type={isPublished ? 'success' : ''}>
							{isPublished
								? __('Published', 'surecart')
								: __('Draft', 'surecart')}
						</sc-tag>
					);
				},
			},
			{
				id: 'featured',
				label: __('Featured', 'surecart'),
				enableSorting: false,
				render: ({ item }) => (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill={item?.featured ? 'currentColor' : 'none'}
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
					</svg>
				),
			},
			{
				id: 'date',
				label: __('Created', 'surecart'),
				enableSorting: true,
				render: ({ item }) => item?.cataloged_at_date_time || '-',
			},
		],
		[collectionElements]
	);

	// ─── Action handlers ───
	const handleArchiveToggle = useCallback(
		async (items) => {
			setIsMutating(true);
			try {
				await Promise.all(
					items.map((item) =>
						saveEntityRecord(
							'surecart',
							'product',
							{ id: item.id, archived: !item.archived },
							{ throwOnError: true }
						)
					)
				);
				// Re-fetch the list so archived items disappear from the current tab.
				invalidateList();
				createSuccessNotice(
					items.length === 1
						? items[0].archived
							? __('Product unarchived.', 'surecart')
							: __('Product archived.', 'surecart')
						: sprintf(
								_n(
									'%d product updated.',
									'%d products updated.',
									items.length,
									'surecart'
								),
								items.length
						  ),
					{ type: 'snackbar' }
				);
			} catch (error) {
				createErrorNotice(
					error?.message ||
						__('Failed to update product.', 'surecart'),
					{ type: 'snackbar' }
				);
			} finally {
				setIsMutating(false);
			}
		},
		[
			saveEntityRecord,
			createSuccessNotice,
			createErrorNotice,
			invalidateList,
		]
	);

	const handleDuplicate = useCallback(
		async (items) => {
			setIsMutating(true);
			try {
				await Promise.all(
					items.map((item) =>
						apiFetch({
							path: `/surecart/v1/products/${item.id}/duplicate`,
							method: 'POST',
						})
					)
				);
				// Re-fetch the list so the new duplicate appears.
				invalidateList();
				createSuccessNotice(
					__('Product duplicated successfully.', 'surecart'),
					{ type: 'snackbar' }
				);
			} catch (error) {
				createErrorNotice(
					error?.message ||
						__('Failed to duplicate product.', 'surecart'),
					{ type: 'snackbar' }
				);
			} finally {
				setIsMutating(false);
			}
		},
		[createSuccessNotice, createErrorNotice, invalidateList]
	);

	// ─── Action definitions ───
	const actions = useMemo(
		() => [
			{
				id: 'edit',
				label: __('Edit', 'surecart'),
				icon: <Icon icon={edit} />,
				callback: ([item]) => {
					navigation.goToEdit(item.id);
				},
			},
			{
				id: 'archive',
				label: __('Archive', 'surecart'),
				icon: <Icon icon={archive} />,
				isEligible: (item) => !item.archived,
				supportsBulk: true,
				callback: (items) => handleArchiveToggle(items),
			},
			{
				id: 'unarchive',
				label: __('Un-Archive', 'surecart'),
				icon: <Icon icon={archive} />,
				isEligible: (item) => !!item.archived,
				supportsBulk: true,
				callback: (items) => handleArchiveToggle(items),
			},
			{
				id: 'view',
				label: __('View Product', 'surecart'),
				icon: <Icon icon={external} />,
				isEligible: (item) => !!item.permalink,
				callback: ([item]) => {
					window.open(item.permalink, '_blank');
				},
			},
			{
				id: 'duplicate',
				label: __('Duplicate', 'surecart'),
				icon: <Icon icon={copy} />,
				// Single-item only — bulk duplicate is not supported.
				callback: ([item]) => handleDuplicate([item]),
			},
			{
				id: 'delete',
				icon: <Icon icon={trash} />,
				label: __('Delete permanently', 'surecart'),
				isDestructive: true,
				supportsBulk: true,
				// Redirect to the PHP bulk-delete confirmation page (handles both
				// single and bulk). The server shows a confirmation form with a
				// nonce before performing the actual deletion.
				callback: (items) => {
					const params = new URLSearchParams({
						page: 'sc-products',
						action: 'delete',
					});
					items.forEach((item, i) =>
						params.append(`bulk_action_product_ids[${i}]`, item.id)
					);
					window.location.href = `admin.php?${params.toString()}`;
				},
			},
		],
		[handleArchiveToggle, handleDuplicate, navigation]
	);

	return (
		<DataViewListLayout
			data={records}
			fields={fields}
			view={view}
			onChangeView={setView}
			paginationInfo={paginationInfo}
			actions={actions}
			isLoading={!hasResolved}
			isMutating={isMutating}
		/>
	);
}
