/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { useDispatch, select, dispatch, resolveSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import {
	DataViewListLayout,
	useDataViewState,
	useUrlFilterWriter,
	readInitialFiltersFromUrl,
	StatusSidebar,
	useEnhancedView,
	applyDefaultFieldsExtensions,
} from '../components/dataview-list';
import ListHeader from '../components/ListHeader';
import useProductIntegrations from './hooks/useProductIntegrations';
import { buildProductFields } from './list/fields';
import { buildProductActions } from './list/actions';
import {
	buildProductsQuery,
	PRODUCTS_DEFAULT_SORT,
	PRODUCTS_SORT_MAP,
} from './list/buildQuery';
import { PRODUCTS_URL_FILTERS } from './list/urlFilters';
import { useStatusTabs } from './list/useStatusTabs';
import {
	useExpandedVariants,
	useSavingVariantIds,
	injectVariantRows,
	applyVariantRenderers,
} from './list/variants';
import VariantEditPanel from './modules/Variations/VariantEditPanel';
import './product-list-style.scss';

const LAYOUT_STYLES = {
	name: { width: '25%' },
	sku: { width: '8%' },
	price: { width: '7%' },
	commission_amount: { width: '8%' },
	quantity: { width: '4%' },
	integrations: { width: '10%' },
	product_collections: { width: '10%' },
	status: { width: '6%' },
	featured: { width: '5%' },
	created_at: { width: '10%' },
};

const DEFAULT_FIELDS = [
	'name',
	'status',
	'quantity',
	'price',
	'product_collections',
];
const PREFERENCE_KEY = 'products-list-view';

export default ({ navigation }) => {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	// Enhanced-view state is also read by `DataViewListLayout` internally;
	// pulling it here so the sidebar's back-chevron can call `toggle` to
	// exit enhanced view without a page reload.
	const { toggle: toggleEnhancedView } = useEnhancedView();

	const [isMutating, setIsMutating] = useState(false);

	const expanded = useExpandedVariants();
	const saving = useSavingVariantIds();
	const [editingVariant, setEditingVariant] = useState(null);

	// Pre-fetch collections for the filter dropdown. DataViews' `field.elements`
	// expects a static array — async element resolvers aren't reliable across
	// bundled WP versions yet, so we eager-fetch a generous batch.
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

	// Seed filters from the URL on mount; written back via useUrlFilterWriter.
	const initialViewFilters = useMemo(
		() => readInitialFiltersFromUrl(PRODUCTS_URL_FILTERS),
		[]
	);

	// Default visible fields can be extended by plugins.
	const defaultFields = useMemo(
		() => applyDefaultFieldsExtensions('products', DEFAULT_FIELDS),
		[]
	);

	const {
		view,
		setView,
		records,
		hasResolved,
		paginationInfo,
		invalidateList,
	} = useDataViewState({
		entity: 'product',
		defaultSort: PRODUCTS_DEFAULT_SORT,
		sortMap: PRODUCTS_SORT_MAP,
		defaultFields,
		layoutStyles: LAYOUT_STYLES,
		initialViewFilters,
		preferenceKey: PREFERENCE_KEY,
		buildQueryArgs: ({ view: currentView }) => {
			// Per-screen filter args; useDataViewState already adds
			// per_page/page/sort/query.
			const full = buildProductsQuery(currentView);
			delete full.per_page;
			delete full.page;
			delete full.sort;
			delete full.query;
			return full;
		},
	});

	useUrlFilterWriter({
		pageSlug: 'sc-products',
		filters: PRODUCTS_URL_FILTERS,
		view,
	});

	// Remove polluted fields from the view when in table mode.
	// These fields are only relevant to card-based layouts,
	// and can cause confusion when accidentally left enabled in table view.
	useEffect(() => {
		if (view?.type !== 'table') return;
		const polluted =
			view.titleField || view.mediaField || view.descriptionField;
		if (!polluted) return;
		setView({
			...view,
			titleField: undefined,
			mediaField: undefined,
			descriptionField: undefined,
		});
	}, [view, setView]);

	const { tabs, activeValue, setTab } = useStatusTabs({ view, setView });

	// Async-fetched integrations enrichment for the integrations column.
	const integrationsEnabled = view.fields?.includes('integrations') ?? false;
	const { integrationsByProduct, providers, itemLabels } =
		useProductIntegrations(records, integrationsEnabled);

	// Build the field set, passing the integrations bag so the field's
	// own renderer reads from the resolved data. Re-runs only when the
	// bag changes — and the integrations field is hidden by default, so
	// this stays cheap.
	const baseFields = useMemo(
		() =>
			buildProductFields({
				navigation,
				elements: collectionElements,
				integrationsByProduct,
				providers,
				itemLabels,
			}),
		[
			navigation,
			collectionElements,
			integrationsByProduct,
			providers,
			itemLabels,
		]
	);

	// Variants are a tabular concept — chevron/sub-rows/cell renderers
	// only run in table view. In grid/list, the `name` field renders
	// as bare text so it doesn't double up with the card's mediaField.
	const isTableView = view?.type === 'table';

	const fields = useMemo(
		() =>
			applyVariantRenderers(baseFields, {
				expandedIds: expanded.ids,
				onToggle: expanded.toggle,
				savingVariantIds: saving.ids,
				viewType: view?.type,
			}),
		[baseFields, expanded.ids, expanded.toggle, saving.ids, view?.type]
	);

	const dataWithVariants = useMemo(
		() =>
			isTableView ? injectVariantRows(records, expanded.ids) : records,
		[isTableView, records, expanded.ids]
	);

	const handleArchiveToggle = useCallback(
		async (items) => {
			setIsMutating(true);
			try {
				if (items.length === 1) {
					// Single mutation — go direct so core-data caches the
					// optimistic update and the row updates instantly.
					const item = items[0];
					await saveEntityRecord(
						'surecart',
						'product',
						{ id: item.id, archived: !item.archived },
						{ throwOnError: true }
					);
				} else {
					// Bulk — submit one Batch API request and let the platform
					// process N PATCHes asynchronously. Far kinder to rate
					// limits than the previous N-fanout from the browser.
					await apiFetch({
						path: '/surecart/v1/batches',
						method: 'POST',
						data: {
							batch_operations: items.map((item) => ({
								http_method: 'PATCH',
								path: `/v1/products/${item.id}`,
								body: {
									product: { archived: !item.archived },
								},
							})),
						},
					});
				}
				invalidateList();
				createSuccessNotice(
					items.length === 1
						? items[0].archived
							? __('Product unarchived.', 'surecart')
							: __('Product archived.', 'surecart')
						: sprintf(
								/* translators: %d is the number of products in the batch. */
								_n(
									'Queued %d product for update. Refresh in a moment to see the result.',
									'Queued %d products for update. Refresh in a moment to see the result.',
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

	const handleDelete = useCallback(
		async (items) => {
			try {
				await Promise.all(
					items.map((item) =>
						deleteEntityRecord('surecart', 'product', item.id, {
							throwOnError: true,
						})
					)
				);
				invalidateList();
				createSuccessNotice(
					sprintf(
						_n(
							'Successfully deleted %d product.',
							'Successfully deleted %d products.',
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
						__('Failed to delete product.', 'surecart'),
					{ type: 'snackbar' }
				);
				throw error;
			}
		},
		[
			deleteEntityRecord,
			createSuccessNotice,
			createErrorNotice,
			invalidateList,
		]
	);

	const handleDeleteVariant = useCallback(
		async ({ productId, variantId }) => {
			if (!productId || !variantId) return;
			setIsMutating(true);
			try {
				// resolveSelect (not just select) — the list's fetcher
				// doesn't always prime the per-record cache. Without
				// this we'd read `{}` and PATCH `variants: []`, wiping siblings.
				await resolveSelect(coreStore).getEntityRecord(
					'surecart',
					'product',
					productId
				);

				const current = select(coreStore).getEditedEntityRecord(
					'surecart',
					'product',
					productId
				);
				const sourceVariants = Array.isArray(current?.variants)
					? current.variants
					: current?.variants?.data || [];

				// Belt-and-suspenders for the same data-loss scenario.
				if (sourceVariants.length === 0) {
					throw new Error(
						__(
							'Could not load the product variants. Refresh the page and try again.',
							'surecart'
						)
					);
				}

				// Soft delete — flip just the targeted variant.
				const next = sourceVariants.map((v) =>
					v?.id !== variantId ? v : { ...v, status: 'draft' }
				);

				await dispatch(coreStore).editEntityRecord(
					'surecart',
					'product',
					productId,
					{ variants: next }
				);
				await dispatch(coreStore).saveEditedEntityRecord(
					'surecart',
					'product',
					productId,
					{ throwOnError: true }
				);

				invalidateList();
				createSuccessNotice(__('Variant deleted.', 'surecart'), {
					type: 'snackbar',
				});
			} catch (error) {
				createErrorNotice(
					error?.message ||
						__('Failed to delete variant.', 'surecart'),
					{ type: 'snackbar' }
				);
			} finally {
				setIsMutating(false);
			}
		},
		[invalidateList, createSuccessNotice, createErrorNotice]
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

	const actions = useMemo(
		() =>
			buildProductActions({
				navigation,
				handleArchiveToggle,
				handleDuplicate,
				handleDelete,
				handleDeleteVariant,
				onEditVariant: setEditingVariant,
			}),
		[
			navigation,
			handleArchiveToggle,
			handleDuplicate,
			handleDelete,
			handleDeleteVariant,
		]
	);

	return (
		<>
			<DataViewListLayout
				pageHeader={
					<ListHeader
						title={__('Products', 'surecart')}
						actionLabel={__('Add Product', 'surecart')}
						actionHref={addQueryArgs('admin.php', {
							page: 'sc-products',
							action: 'edit',
						})}
						onAction={() => navigation.goToCreate()}
					/>
				}
				statusSidebar={
					<StatusSidebar
						siteName={
							window?.scData?.site_name ||
							(window?.location?.hostname ?? '')
						}
						siteHref={
							window?.scData?.home_url || window?.location?.origin
						}
						siteIconUrl={window?.scData?.site_icon_url || ''}
						dashboardHref="index.php"
						heading={__('Products', 'surecart')}
						description={__(
							'Add, edit, and manage the products you sell in your store.',
							'surecart'
						)}
						onBack={toggleEnhancedView}
						tabs={tabs}
						activeValue={activeValue}
						onChange={setTab}
					/>
				}
				defaultLayouts={{
					table: {},
					grid: {
						mediaField: 'media',
						titleField: 'display_name',
						descriptionField: 'price',
					},
					list: {
						mediaField: 'media',
						titleField: 'display_name',
						descriptionField: 'price',
					},
				}}
				data={dataWithVariants}
				fields={fields}
				view={view}
				onChangeView={setView}
				paginationInfo={paginationInfo}
				actions={actions}
				isLoading={!hasResolved}
				isMutating={isMutating}
			/>
			{editingVariant && (
				<VariantEditPanel
					productId={editingVariant.productId}
					variantId={editingVariant.variantId}
					onClose={() => setEditingVariant(null)}
					onSavingStart={(id) => saving.start(id)}
					onSavingEnd={(id) => saving.end(id)}
					onSaved={() => invalidateList()}
				/>
			)}
		</>
	);
};
