/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { useMemo, useCallback, useState } from 'react';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import {
	DataViewListLayout,
	useDataViewState,
	StatusSidebar,
	useEnhancedView,
	applyDefaultFieldsExtensions,
	ModernViewIntroModal,
} from '../components/dataview-list';
import useSiteContext from '../hooks/useSiteContext';
import useModernViewIntroProps from '../hooks/useModernViewIntroProps';
import useListMutation from '../hooks/useListMutation';
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
import { refreshProductRow } from './list/refreshProductRow';
import { useStatusTabs } from './list/useStatusTabs';
import { submitBatchOperations } from '../util/batches';
import {
	useLazyVariants,
	useSavingVariantIds,
	injectVariantRows,
	applyVariantRenderers,
	productOnlyItems,
	patchVariant,
} from './list/variants';
import VariantEditPanel from './modules/Variations/VariantEditPanel';
import './product-list-style.scss';

const LAYOUT_STYLES = {
	name: { width: '22%' },
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

const productsQueryArgs = ({ view }) => buildProductsQuery(view);

export default ({ navigation }) => {
	const { saveEntityRecord, deleteEntityRecord, receiveEntityRecords } =
		useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();
	const siteContext = useSiteContext();
	const introProps = useModernViewIntroProps();

	const { isMutating, run: runMutation } = useListMutation();

	const expanded = useLazyVariants();
	const saving = useSavingVariantIds();
	const [editingVariant, setEditingVariant] = useState(null);

	// Filter dropdown only needs id+name — `expand: []` overrides the
	// entity default (`expand: ['media']`) so up to 100 media objects
	// aren't fetched and thrown away. Empty arrays serialize to no param.
	const { records: collectionRecords } = useEntityRecords(
		'surecart',
		'product-collection',
		{ per_page: 100, expand: [] }
	);
	const collectionElements = useMemo(
		() =>
			(collectionRecords || []).map((c) => ({
				value: c.id,
				label: c.name,
			})),
		[collectionRecords]
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
		queryArgs,
	} = useDataViewState({
		entity: 'product',
		defaultSort: PRODUCTS_DEFAULT_SORT,
		sortMap: PRODUCTS_SORT_MAP,
		defaultFields,
		layoutStyles: LAYOUT_STYLES,
		preferenceKey: PREFERENCE_KEY,
		pageSlug: 'sc-products',
		urlFilters: PRODUCTS_URL_FILTERS,
		buildQueryArgs: productsQueryArgs,
	});

	const { tabs, activeValue, setTab } = useStatusTabs({
		view,
		setView,
	});

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
				setView,
				elements: collectionElements,
				integrationsByProduct,
				providers,
				itemLabels,
			}),
		[
			navigation,
			setView,
			collectionElements,
			integrationsByProduct,
			providers,
			itemLabels,
		]
	);

	const fields = useMemo(
		() =>
			applyVariantRenderers(baseFields, {
				expandedIds: expanded.ids,
				onToggle: expanded.toggle,
				savingVariantIds: saving.ids,
				onRetry: expanded.retry,
			}),
		[baseFields, expanded.ids, expanded.toggle, expanded.retry, saving.ids]
	);

	const dataWithVariants = useMemo(
		() =>
			injectVariantRows(records, expanded.ids, {
				variantsByProduct: expanded.variantsByProduct,
				loadingIds: expanded.loadingIds,
				failedIds: expanded.failedIds,
			}),
		[
			records,
			expanded.ids,
			expanded.variantsByProduct,
			expanded.loadingIds,
			expanded.failedIds,
		]
	);

	const handleArchiveToggle = useCallback(
		(items) => {
			const products = productOnlyItems(items);
			if (!products.length) return;

			return runMutation(
				async () => {
					if (products.length === 1) {
						// Single mutation — go direct so core-data caches the
						// optimistic update and the row updates instantly.
						const item = products[0];
						await saveEntityRecord(
							'surecart',
							'product',
							{ id: item.id, archived: !item.archived },
							{ throwOnError: true }
						);
					} else {
						// Bulk — Batch API requests processed asynchronously by
						// the platform. Far kinder to rate limits than the
						// previous N-fanout from the browser.
						await submitBatchOperations(
							products.map((item) => ({
								http_method: 'PATCH',
								path: `/v1/products/${item.id}`,
								body: {
									product: { archived: !item.archived },
								},
							}))
						);
					}
					invalidateList();
					createSuccessNotice(
						products.length === 1
							? products[0].archived
								? __('Product unarchived.', 'surecart')
								: __('Product archived.', 'surecart')
							: sprintf(
									/* translators: %d is the number of updated products. */
									_n(
										'Updated %d product.',
										'Updated %d products.',
										products.length,
										'surecart'
									),
									products.length
							  ),
						{ type: 'snackbar' }
					);
				},
				{ errorMessage: __('Failed to update product.', 'surecart') }
			);
		},
		[runMutation, saveEntityRecord, createSuccessNotice, invalidateList]
	);

	const handleDelete = useCallback(
		(items) => {
			const products = productOnlyItems(items);
			if (!products.length) return;

			return runMutation(async () => {
				const results = await Promise.allSettled(
					products.map((item) =>
						deleteEntityRecord('surecart', 'product', item.id, {
							throwOnError: true,
						})
					)
				);
				const succeeded = results.filter(
					(r) => r.status === 'fulfilled'
				).length;
				const failed = results.length - succeeded;
				invalidateList();
				if (succeeded > 0 && failed === 0) {
					createSuccessNotice(
						sprintf(
							/* translators: %d is the number of deleted products. */
							_n(
								'Successfully deleted %d product.',
								'Successfully deleted %d products.',
								succeeded,
								'surecart'
							),
							succeeded
						),
						{ type: 'snackbar' }
					);
				} else if (succeeded > 0 && failed > 0) {
					createErrorNotice(
						sprintf(
							/* translators: 1: succeeded count, 2: failed count. */
							__('Deleted %1$d, failed %2$d.', 'surecart'),
							succeeded,
							failed
						),
						{ type: 'snackbar' }
					);
				} else {
					const firstError = results.find(
						(r) => r.status === 'rejected'
					);
					throw new Error(
						firstError?.reason?.message ||
							__('Failed to delete product.', 'surecart')
					);
				}
			});
		},
		[
			runMutation,
			deleteEntityRecord,
			createSuccessNotice,
			createErrorNotice,
			invalidateList,
		]
	);

	const handleDeleteVariant = useCallback(
		({ productId, variantId }) => {
			if (!productId || !variantId) return;

			return runMutation(
				async () => {
					// Optimistic: receives merge by field, and the inline rows
					// filter drafts out — so the row disappears immediately.
					receiveEntityRecords('surecart', 'variant', {
						id: variantId,
						status: 'draft',
					});

					try {
						// Soft delete via a direct single-variant PATCH —
						// siblings are untouched, and unlike saveEntityRecord
						// this doesn't refetch every expanded row's variants.
						const saved = await patchVariant(variantId, {
							status: 'draft',
						});
						receiveEntityRecords('surecart', 'variant', saved);
					} catch (error) {
						// Restore server truth before surfacing the error.
						expanded.retry(productId);
						throw error;
					}

					// Refresh just this product's row — its aggregates
					// (price range, stock) may include the deleted variant.
					// Best-effort: a miss leaves the row momentarily stale.
					refreshProductRow(productId, {
						expand: queryArgs.expand,
					}).catch(() => {});
					createSuccessNotice(__('Variant deleted.', 'surecart'), {
						type: 'snackbar',
					});
				},
				{ errorMessage: __('Failed to delete variant.', 'surecart') }
			);
		},
		[
			runMutation,
			receiveEntityRecords,
			queryArgs.expand,
			expanded.retry,
			createSuccessNotice,
		]
	);

	// Partial-success path is handled below — only the all-failed branch
	// re-throws so `runMutation` surfaces the snackbar error.
	const handleDuplicate = useCallback(
		(items) => {
			const products = productOnlyItems(items);
			if (!products.length) return;

			return runMutation(async () => {
				const results = await Promise.allSettled(
					products.map((item) =>
						apiFetch({
							path: `/surecart/v1/products/${item.id}/duplicate`,
							method: 'POST',
						})
					)
				);
				const succeeded = results.filter(
					(r) => r.status === 'fulfilled'
				).length;
				const failed = results.length - succeeded;
				invalidateList();
				if (succeeded > 0 && failed === 0) {
					createSuccessNotice(
						sprintf(
							/* translators: %d is the number of duplicated products. */
							_n(
								'Duplicated %d product.',
								'Duplicated %d products.',
								succeeded,
								'surecart'
							),
							succeeded
						),
						{ type: 'snackbar' }
					);
				} else if (succeeded > 0 && failed > 0) {
					createErrorNotice(
						sprintf(
							/* translators: 1: succeeded count, 2: failed count. */
							__('Duplicated %1$d, failed %2$d.', 'surecart'),
							succeeded,
							failed
						),
						{ type: 'snackbar' }
					);
				} else {
					const firstError = results.find(
						(r) => r.status === 'rejected'
					);
					throw new Error(
						firstError?.reason?.message ||
							__('Failed to duplicate product.', 'surecart')
					);
				}
			});
		},
		[runMutation, createSuccessNotice, createErrorNotice, invalidateList]
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
						{...siteContext}
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
				defaultLayouts={{ table: {} }}
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
					product={editingVariant.product}
					variantId={editingVariant.variantId}
					onClose={() => setEditingVariant(null)}
					onSavingStart={(id) => saving.start(id)}
					onSavingEnd={(id) => saving.end(id)}
					onSaved={() => {
						// Rows already show the edit; only this product's
						// aggregates (price range, stock) need refreshing —
						// one lean record, not the whole list. Best-effort.
						refreshProductRow(editingVariant.product?.id, {
							expand: queryArgs.expand,
						}).catch(() => {});
					}}
				/>
			)}

			{introProps && <ModernViewIntroModal {...introProps} />}
		</>
	);
};
