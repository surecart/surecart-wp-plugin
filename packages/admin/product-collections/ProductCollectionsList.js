/** @jsx jsx */
import { jsx } from '@emotion/react';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { useMemo, useCallback } from 'react';
import { store as noticesStore } from '@wordpress/notices';
import {
	DataViewListLayout,
	useDataViewState,
	StatusSidebar,
	useEnhancedView,
	applyDefaultFieldsExtensions,
	ModernViewIntroModal,
} from '../components/dataview-list';
import ListHeader from '../components/ListHeader';
import { buildCollectionFields } from './list/fields';
import { buildCollectionActions } from './list/actions';
import {
	buildCollectionsQuery,
	COLLECTIONS_DEFAULT_SORT,
	COLLECTIONS_SORT_MAP,
} from './list/buildQuery';
import './product-collections-list-style.scss';

const LAYOUT_STYLES = {
	name: { width: '30%' },
	products_count: { width: '100px' },
};

const DEFAULT_FIELDS = ['name', 'products_count', 'description', 'created'];
const PREFERENCE_KEY = 'product-collections-list-view';

export default ({ navigation }) => {
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();

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
		buildQueryArgs: ({ view: currentView }) => {
			const full = buildCollectionsQuery(currentView);
			delete full.per_page;
			delete full.page;
			delete full.sort;
			delete full.query;
			return full;
		},
	});

	const fields = useMemo(
		() => buildCollectionFields({ navigation }),
		[navigation]
	);

	const handleDelete = useCallback(
		async (items) => {
			try {
				await Promise.all(
					items.map((item) =>
						deleteEntityRecord(
							'surecart',
							'product-collection',
							item.id,
							{ throwOnError: true }
						)
					)
				);
				invalidateList();
				createSuccessNotice(
					sprintf(
						_n(
							'Successfully deleted %d collection.',
							'Successfully deleted %d collections.',
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
						__('Failed to delete collection.', 'surecart'),
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
						siteName={
							window?.scData?.site_name ||
							(window?.location?.hostname ?? '')
						}
						siteHref={
							window?.scData?.home_url || window?.location?.origin
						}
						siteIconUrl={window?.scData?.site_icon_url || ''}
						dashboardHref="index.php"
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
			/>

			{window?.scData?.modern_view_intro?.enabled && (
				<ModernViewIntroModal
					enabled={!!window.scData.modern_view_intro.enabled}
					dismissed={!!window.scData.modern_view_intro.dismissed}
					imageUrl={window.scData.modern_view_intro.image_url}
					toggleId={window.scData.modern_view_intro.toggle_id}
					dismissUrl={window.scData.modern_view_intro.dismiss_url}
					dismissNonce={window.scData.modern_view_intro.dismiss_nonce}
				/>
			)}
		</>
	);
};
