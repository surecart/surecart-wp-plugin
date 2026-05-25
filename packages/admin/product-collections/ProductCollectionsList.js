/** @jsx jsx */
import { jsx } from '@emotion/react';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
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
	useProductElements,
} from '../components/dataview-list';
import useSiteContext from '../hooks/useSiteContext';
import useModernViewIntroProps from '../hooks/useModernViewIntroProps';
import useListMutation from '../hooks/useListMutation';
import ListHeader from '../components/ListHeader';
import { buildCollectionFields } from './list/fields';
import { buildCollectionActions } from './list/actions';
import {
	buildCollectionsQuery,
	COLLECTIONS_DEFAULT_SORT,
	COLLECTIONS_SORT_MAP,
} from './list/buildQuery';
import { COLLECTIONS_URL_FILTERS } from './list/urlFilters';
import './product-collections-list-style.scss';

const LAYOUT_STYLES = {
	name: { width: '30%' },
	products_count: { width: '100px' },
};

const DEFAULT_FIELDS = ['name', 'products_count', 'description', 'created'];
const PREFERENCE_KEY = 'product-collections-list-view';

const collectionsQueryArgs = ({ view }) => buildCollectionsQuery(view);

export default ({ navigation }) => {
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();
	const siteContext = useSiteContext();
	const introProps = useModernViewIntroProps();
	const { isMutating, run: runMutation } = useListMutation();

	const productElements = useProductElements();

	const defaultFields = useMemo(
		() =>
			applyDefaultFieldsExtensions('product-collections', DEFAULT_FIELDS),
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
		entity: 'product-collection',
		defaultSort: COLLECTIONS_DEFAULT_SORT,
		sortMap: COLLECTIONS_SORT_MAP,
		defaultFields,
		layoutStyles: LAYOUT_STYLES,
		preferenceKey: PREFERENCE_KEY,
		pageSlug: 'sc-product-collections',
		urlFilters: COLLECTIONS_URL_FILTERS,
		buildQueryArgs: collectionsQueryArgs,
	});

	const fields = useMemo(
		() => buildCollectionFields({ navigation, elements: productElements }),
		[navigation, productElements]
	);

	const handleDelete = useCallback(
		(items) =>
			runMutation(
				async () => {
					if (items.length === 1) {
						await deleteEntityRecord(
							'surecart',
							'product-collection',
							items[0].id,
							{ throwOnError: true }
						);
						invalidateList();
						createSuccessNotice(
							__('Collection deleted.', 'surecart'),
							{ type: 'snackbar' }
						);
						return;
					}

					await apiFetch({
						path: '/surecart/v1/batches',
						method: 'POST',
						data: {
							batch_operations: items.map((item) => ({
								http_method: 'DELETE',
								path: `/v1/product_collections/${item.id}`,
							})),
						},
					});
					invalidateList();
					createSuccessNotice(
						sprintf(
							/* translators: %d is the number of collections queued for deletion. */
							_n(
								'Queued %d collection for deletion. Refresh in a moment to see the result.',
								'Queued %d collections for deletion. Refresh in a moment to see the result.',
								items.length,
								'surecart'
							),
							items.length
						),
						{ type: 'snackbar' }
					);
				},
				{ errorMessage: __('Failed to delete collection.', 'surecart') }
			),
		[runMutation, deleteEntityRecord, createSuccessNotice, invalidateList]
	);

	const actions = useMemo(
		() => buildCollectionActions({ navigation, handleDelete }),
		[navigation, handleDelete]
	);

	return (
		<>
			<DataViewListLayout
				pageHeader={
					<ListHeader
						title={__('Product Collections', 'surecart')}
						actionLabel={__('Add Collection', 'surecart')}
						actionHref={addQueryArgs('admin.php', {
							page: 'sc-product-collections',
							action: 'edit',
						})}
						onAction={() => navigation.goToCreate()}
					/>
				}
				statusSidebar={
					<StatusSidebar
						{...siteContext}
						heading={__('Product Collections', 'surecart')}
						description={__(
							'Group products into collections to organize your storefront.',
							'surecart'
						)}
						onBack={toggleEnhancedView}
						tabs={[]}
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
