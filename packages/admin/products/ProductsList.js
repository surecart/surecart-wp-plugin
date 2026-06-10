/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { useDispatch, select, dispatch, resolveSelect } from '@wordpress/data';
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
import { useStatusTabs } from './list/useStatusTabs';
import {
	useExpandedVariants,
	useSavingVariantIds,
	injectVariantRows,
	applyVariantRenderers,
	productOnlyItems,
} from './list/variants';
import VariantEditPanel from './modules/Variations/VariantEditPanel';
import { toVariantsArray } from './modules/Variations/utils';
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
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();
	const siteContext = useSiteContext();
	const introProps = useModernViewIntroProps();

	const { isMutating, run: runMutation } = useListMutation();

	const expanded = useExpandedVariants();
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
			}),
		[baseFields, expanded.ids, expanded.toggle, saving.ids]
	);

	const dataWithVariants = useMemo(
		() => injectVariantRows(records, expanded.ids),
		[records, expanded.ids]
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
						// Bulk — submit one Batch API request and let the platform
						// process N PATCHes asynchronously. Far kinder to rate
						// limits than the previous N-fanout from the browser.
						await apiFetch({
							path: '/surecart/v1/batches',
							method: 'POST',
							data: {
								batch_operations: products.map((item) => ({
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
						products.length === 1
							? products[0].archived
								? __('Product unarchived.', 'surecart')
								: __('Product archived.', 'surecart')
							: sprintf(
									/* translators: %d is the number of products in the batch. */
									_n(
										'Queued %d product for update. Refresh in a moment to see the result.',
										'Queued %d products for update. Refresh in a moment to see the result.',
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
		[
			runMutation,
			saveEntityRecord,
			createSuccessNotice,
			invalidateList,
		]
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
					const sourceVariants = toVariantsArray(current?.variants);

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
				},
				{ errorMessage: __('Failed to delete variant.', 'surecart') }
			);
		},
		[runMutation, invalidateList, createSuccessNotice]
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
		[
			runMutation,
			createSuccessNotice,
			createErrorNotice,
			invalidateList,
		]
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
					productId={editingVariant.productId}
					variantId={editingVariant.variantId}
					onClose={() => setEditingVariant(null)}
					onSavingStart={(id) => saving.start(id)}
					onSavingEnd={(id) => saving.end(id)}
					onSaved={() => invalidateList()}
				/>
			)}

			{introProps && <ModernViewIntroModal {...introProps} />}
		</>
	);
};
