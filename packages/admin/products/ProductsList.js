/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { Icon } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import { ScTag, ScTooltip } from '@surecart/components-react';
import {
	DataViewListLayout,
	useDataViewState,
} from '../components/dataview-list';
import ListHeader from '../components/ListHeader';
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

// Maps view-field ids to API sort field names.
const SORT_MAP = {
	name: 'name',
	created_at: 'cataloged_at',
};

const LAYOUT_STYLES = {
	name: { width: '25%' },
	price: { width: '7%' },
	commission_amount: { width: '8%' },
	quantity: { width: '4%' },
	integrations: { width: '10%' },
	product_collections: { width: '10%' },
	status: { width: '6%' },
	featured: { width: '5%' },
	created_at: { width: '10%' },
};

const DEFAULT_FIELDS = ['name', 'status', 'price', 'product_collections'];
const PREFERENCE_KEY = 'products-list-view';

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
 * @param {Object} props.navigation - SPA navigation from useAdminSpaNavigation.
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

	// Batch-fetch integrations for all visible products.
	const [integrationsByProduct, setIntegrationsByProduct] = useState({});
	const [integrationProviders, setIntegrationProviders] = useState({});
	const [integrationItemLabels, setIntegrationItemLabels] = useState({});
	const prevProductIdsRef = useRef('');

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
		defaultSort: { field: 'created_at', direction: 'desc' },
		sortMap: SORT_MAP,
		defaultFields: DEFAULT_FIELDS,
		layoutStyles: LAYOUT_STYLES,
		initialViewFilters: INITIAL_VIEW_FILTERS,
		preferenceKey: PREFERENCE_KEY,
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

	// Fetch integrations for visible products.
	useEffect(() => {
		if (!records?.length) return;
		const productIds = records.map((r) => r.id);
		const key = productIds.join(',');
		// Skip if product list hasn't changed.
		if (key === prevProductIdsRef.current) return;
		prevProductIdsRef.current = key;

		const controller = new AbortController();
		(async () => {
			try {
				// Fetch integrations for all visible products in one request.
				const integrations = await apiFetch({
					path: addQueryArgs('/surecart/v1/integrations', {
						model_ids: productIds,
						per_page: 100,
						context: 'edit',
					}),
					signal: controller.signal,
				});

				// Group by model_id (product).
				const grouped = {};
				for (const integration of integrations) {
					if (!grouped[integration.model_id]) {
						grouped[integration.model_id] = [];
					}
					grouped[integration.model_id].push(integration);
				}
				setIntegrationsByProduct(grouped);

				// Fetch provider metadata if we have integrations.
				if (integrations.length) {
					// Get unique provider slugs from the integrations.
					const uniqueProviders = [
						...new Set(integrations.map((i) => i.provider)),
					];
					// Fetch each provider's metadata.
					const providerResults = await Promise.all(
						uniqueProviders.map((slug) =>
							apiFetch({
								path: addQueryArgs(
									`/surecart/v1/integration_providers/${slug}`,
									{
										context: 'edit',
										provider: slug,
									}
								),
								signal: controller.signal,
							}).catch(() => null)
						)
					);
					const providerMap = {};
					uniqueProviders.forEach((slug, i) => {
						if (providerResults[i]) {
							providerMap[slug] = providerResults[i];
						}
					});
					setIntegrationProviders(providerMap);

					// Fetch individual item labels for each integration.
					const uniqueItems = integrations.reduce(
						(acc, integration) => {
							const key = `${integration.provider}:${integration.integration_id}`;
							if (!acc.has(key)) {
								acc.set(key, integration);
							}
							return acc;
						},
						new Map()
					);
					const itemResults = await Promise.all(
						[...uniqueItems.values()].map((integration) =>
							apiFetch({
								path: addQueryArgs(
									`/surecart/v1/integration_provider_items/${integration.integration_id}`,
									{
										context: 'edit',
										provider: integration.provider,
									}
								),
								signal: controller.signal,
							}).catch(() => null)
						)
					);
					// Build label map keyed by integration_id.
					const labelMap = {};
					[...uniqueItems.values()].forEach((integration, i) => {
						if (itemResults[i]?.label) {
							labelMap[integration.integration_id] =
								itemResults[i].label;
						}
					});
					setIntegrationItemLabels(labelMap);
				}
			} catch (err) {
				if (err?.name !== 'AbortError') {
					// Silently fail — integrations column just shows '-'.
				}
			}
		})();

		return () => controller.abort();
	}, [records]);

	// ─── Field definitions ───
	const fields = useMemo(
		() => [
			// Archive status filter (not a visible column — only drives the filter dropdown).
			{
				id: 'archive_status',
				label: __('Archive status', 'surecart'),
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
							min-width: 0;
							white-space: normal;
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
						<div
							css={css`
								min-width: 0;
								overflow: hidden;
							`}
						>
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
									word-break: break-word;
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
				id: 'integrations',
				label: __('Integrations', 'surecart'),
				enableSorting: false,
				render: ({ item }) => {
					const itemIntegrations =
						integrationsByProduct[item?.id] || [];
					if (!itemIntegrations.length) {
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
							{itemIntegrations.map((integration) => {
								const provider =
									integrationProviders[integration.provider];
								const label =
									integrationItemLabels[
										integration.integration_id
									] ||
									provider?.label ||
									integration.provider;
								return !!provider?.logo ? (
									<ScTooltip
										key={integration.id}
										text={label}
										css={css`
											display: inline-flex;
										`}
									>
										<img
											src={provider?.logo}
											alt={label}
											css={css`
												width: 20px;
												height: 20px;
												flex: 0 0 20px;
												cursor: help;
											`}
										/>
									</ScTooltip>
								) : (
									<ScTag key={integration.id} type="info">
										{label}
									</ScTag>
								);
							})}
						</div>
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
								<span key={collection.id}>
									{collection.name}
								</span>
							))}
						</div>
					);
				},
			},
			{
				id: 'status',
				label: __('Status', 'surecart'),
				enableSorting: false,
				render: ({ item }) => {
					const isPublished = item?.status === 'published';
					return (
						<ScTag type={isPublished ? 'success' : ''}>
							{isPublished
								? __('Published', 'surecart')
								: __('Draft', 'surecart')}
						</ScTag>
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
				id: 'created_at',
				label: __('Created', 'surecart'),
				enableSorting: true,
				render: ({ item }) => item?.created_at_date || '-',
			},
		],
		[
			collectionElements,
			integrationsByProduct,
			integrationProviders,
			integrationItemLabels,
		]
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
				isPrimary: true,
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
				isPrimary: true,
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
				// Redirect to the PHP bulk-delete confirmation page (handles both single and bulk).
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
		<>
			<ListHeader
				title={__('Products', 'surecart')}
				actionLabel={__('Add Product', 'surecart')}
				actionHref={addQueryArgs('admin.php', {
					page: 'sc-products',
					action: 'edit',
				})}
				onAction={() => navigation.goToCreate()}
			/>
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
		</>
	);
}
