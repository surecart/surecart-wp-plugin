/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { useMemo, useCallback } from 'react';
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
import useProductIntegrations from '../products/hooks/useProductIntegrations';
import { useStatusTabs } from '../products/list/useStatusTabs';
import { PRODUCTS_URL_FILTERS } from '../products/list/urlFilters';
import { submitBatchOperations } from '../util/batches';
import { buildBundleFields } from './list/fields';
import { buildBundleActions } from './list/actions';
import {
	buildBundlesQuery,
	BUNDLES_DEFAULT_SORT,
	BUNDLES_SORT_MAP,
} from './list/buildQuery';
import './bundles-list-style.scss';

const PAGE_SLUG = 'sc-bundles';

const LAYOUT_STYLES = {
	name: { width: '24%' },
	price: { width: '8%' },
	bundle_items: { width: '7%' },
	commission_amount: { width: '8%' },
	integrations: { width: '10%' },
	product_collections: { width: '12%' },
	status: { width: '7%' },
	featured: { width: '5%' },
	created_at: { width: '10%' },
};

const DEFAULT_FIELDS = [
	'name',
	'status',
	'bundle_items',
	'price',
	'product_collections',
];
const PREFERENCE_KEY = 'bundles-list-view';

const bundlesQueryArgs = ({ view }) => buildBundlesQuery(view);

export default ({ navigation }) => {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();
	const siteContext = useSiteContext();
	const introProps = useModernViewIntroProps();
	const { isMutating, run: runMutation } = useListMutation();

	// Filter dropdown only needs id+name — `expand: []` overrides the entity
	// default so up to 100 media objects aren't fetched and thrown away.
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

	const defaultFields = useMemo(
		() => applyDefaultFieldsExtensions('bundles', DEFAULT_FIELDS),
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
		defaultSort: BUNDLES_DEFAULT_SORT,
		sortMap: BUNDLES_SORT_MAP,
		defaultFields,
		layoutStyles: LAYOUT_STYLES,
		preferenceKey: PREFERENCE_KEY,
		pageSlug: PAGE_SLUG,
		urlFilters: PRODUCTS_URL_FILTERS,
		buildQueryArgs: bundlesQueryArgs,
	});

	const { tabs, activeValue, setTab } = useStatusTabs({ view, setView });

	const integrationsEnabled = view.fields?.includes('integrations') ?? false;
	const { integrationsByProduct, providers, itemLabels } =
		useProductIntegrations(records, integrationsEnabled);

	const fields = useMemo(
		() =>
			buildBundleFields({
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

	const handleArchiveToggle = useCallback(
		(items) => {
			if (!items.length) return;

			return runMutation(
				async () => {
					if (items.length === 1) {
						// Single mutation — direct so core-data caches the
						// optimistic update and the row updates instantly.
						const item = items[0];
						await saveEntityRecord(
							'surecart',
							'product',
							{ id: item.id, archived: !item.archived },
							{ throwOnError: true }
						);
					} else {
						// Bulk via the Batch API — processed async by the
						// platform, far kinder to rate limits than an N-fanout.
						await submitBatchOperations(
							items.map((item) => ({
								http_method: 'PATCH',
								path: `/v1/products/${item.id}`,
								body: { product: { archived: !item.archived } },
							}))
						);
					}
					invalidateList();
					createSuccessNotice(
						items.length === 1
							? items[0].archived
								? __('Bundle unarchived.', 'surecart')
								: __('Bundle archived.', 'surecart')
							: sprintf(
									/* translators: %d is the number of updated bundles. */
									_n(
										'Updated %d bundle.',
										'Updated %d bundles.',
										items.length,
										'surecart'
									),
									items.length
							  ),
						{ type: 'snackbar' }
					);
				},
				{ errorMessage: __('Failed to update bundle.', 'surecart') }
			);
		},
		[runMutation, saveEntityRecord, createSuccessNotice, invalidateList]
	);

	const handleDelete = useCallback(
		(items) => {
			if (!items.length) return;

			return runMutation(async () => {
				const results = await Promise.allSettled(
					items.map((item) =>
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
							/* translators: %d is the number of deleted bundles. */
							_n(
								'Successfully deleted %d bundle.',
								'Successfully deleted %d bundles.',
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
							__('Failed to delete bundle.', 'surecart')
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

	const handleDuplicate = useCallback(
		(items) => {
			if (!items.length) return;

			return runMutation(async () => {
				const results = await Promise.allSettled(
					items.map((item) =>
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
							/* translators: %d is the number of duplicated bundles. */
							_n(
								'Duplicated %d bundle.',
								'Duplicated %d bundles.',
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
							__('Failed to duplicate bundle.', 'surecart')
					);
				}
			});
		},
		[runMutation, createSuccessNotice, createErrorNotice, invalidateList]
	);

	const actions = useMemo(
		() =>
			buildBundleActions({
				navigation,
				handleArchiveToggle,
				handleDuplicate,
				handleDelete,
			}),
		[navigation, handleArchiveToggle, handleDuplicate, handleDelete]
	);

	return (
		<>
			<DataViewListLayout
				pageHeader={
					<ListHeader
						title={__('Bundles', 'surecart')}
						actionLabel={__('Add Bundle', 'surecart')}
						actionHref={addQueryArgs('admin.php', {
							page: PAGE_SLUG,
							action: 'edit',
						})}
						onAction={() => navigation.goToCreate()}
					/>
				}
				statusSidebar={
					<StatusSidebar
						{...siteContext}
						heading={__('Bundles', 'surecart')}
						description={__(
							'Group products together and sell them as a single bundle.',
							'surecart'
						)}
						onBack={toggleEnhancedView}
						tabs={tabs}
						activeValue={activeValue}
						onChange={setTab}
					/>
				}
				defaultLayouts={{ table: {} }}
				data={records}
				fields={fields}
				view={view}
				onChangeView={setView}
				paginationInfo={paginationInfo}
				actions={actions}
				isLoading={!hasResolved}
				isMutating={isMutating}
			/>

			{introProps && <ModernViewIntroModal {...introProps} />}
		</>
	);
};
