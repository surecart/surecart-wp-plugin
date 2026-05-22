/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useMemo, useCallback, useState } from 'react';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	DataViewListLayout,
	useDataViewState,
	StatusSidebar,
	useEnhancedView,
	applyDefaultFieldsExtensions,
	ModernViewIntroModal,
	useProductElements,
	useTabRefreshKey,
} from '../components/dataview-list';
import ListHeader from '../components/ListHeader';
import { buildReviewFields } from './list/fields';
import { buildReviewActions } from './list/actions';
import {
	buildReviewsQuery,
	REVIEWS_DEFAULT_SORT,
	REVIEWS_SORT_MAP,
} from './list/buildQuery';
import { REVIEWS_URL_FILTERS } from './list/urlFilters';
import { useStatusTabs } from './list/useStatusTabs';
import './reviews-list-style.scss';

const LAYOUT_STYLES = {
	review: { width: '25%' },
	stars: { width: '12%' },
	customer: { width: '14%' },
	product: { width: '14%' },
	status: { width: '9%' },
	created: { width: '14%' },
};

const DEFAULT_FIELDS = ['review', 'stars', 'product', 'status', 'created'];
const PREFERENCE_KEY = 'reviews-list-view';

export default ({ navigation }) => {
	const { deleteEntityRecord, receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();
	const [isMutating, setIsMutating] = useState(false);

	const productElements = useProductElements();

	const defaultFields = useMemo(
		() => applyDefaultFieldsExtensions('reviews', DEFAULT_FIELDS),
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
		entity: 'review',
		defaultSort: REVIEWS_DEFAULT_SORT,
		sortMap: REVIEWS_SORT_MAP,
		defaultFields,
		layoutStyles: LAYOUT_STYLES,
		preferenceKey: PREFERENCE_KEY,
		pageSlug: 'sc-reviews',
		urlFilters: REVIEWS_URL_FILTERS,
		buildQueryArgs: ({ view: currentView }) => {
			const full = buildReviewsQuery(currentView);
			delete full.per_page;
			delete full.page;
			delete full.sort;
			delete full.query;
			return full;
		},
	});

	const { refreshKey, bump: bumpTabRefresh } = useTabRefreshKey();

	const { tabs, activeValue, setTab } = useStatusTabs({
		view,
		setView,
		refreshKey,
	});

	const fields = useMemo(
		() => buildReviewFields({ navigation, elements: productElements }),
		[navigation, productElements]
	);

	// Sequential, not Promise.all — platform per-resource locks reject parallel writes.
	const mutateStatus = useCallback(
		async (items, endpoint, nextStatus, successLabel, errorLabel) => {
			setIsMutating(true);
			try {
				for (const item of items) {
					const updated = await apiFetch({
						path: `/surecart/v1/reviews/${item.id}/${endpoint}`,
						method: 'PATCH',
					});
					// Prime the cache so the row's status badge flips
					// immediately, before the list re-fetches.
					receiveEntityRecords(
						'surecart',
						'review',
						{
							...updated,
							status: nextStatus,
						},
						undefined,
						false
					);
				}
				invalidateList();
				bumpTabRefresh();
				createSuccessNotice(
					sprintf(
						_n(
							successLabel.one,
							successLabel.many,
							items.length,
							'surecart'
						),
						items.length
					),
					{ type: 'snackbar' }
				);
			} catch (error) {
				createErrorNotice(error?.message || errorLabel, {
					type: 'snackbar',
				});
				throw error;
			} finally {
				setIsMutating(false);
			}
		},
		[
			receiveEntityRecords,
			invalidateList,
			bumpTabRefresh,
			createSuccessNotice,
			createErrorNotice,
		]
	);

	const handleApprove = useCallback(
		(items) =>
			mutateStatus(
				items,
				'publish',
				'published',
				{
					one: 'Approved %d review.',
					many: 'Approved %d reviews.',
				},
				__('Failed to approve review.', 'surecart')
			),
		[mutateStatus]
	);

	const handleReject = useCallback(
		(items) =>
			mutateStatus(
				items,
				'unpublish',
				'unpublished',
				{
					one: 'Rejected %d review.',
					many: 'Rejected %d reviews.',
				},
				__('Failed to reject review.', 'surecart')
			),
		[mutateStatus]
	);

	const handleDelete = useCallback(
		async (items) => {
			try {
				await Promise.all(
					items.map((item) =>
						deleteEntityRecord('surecart', 'review', item.id, {
							throwOnError: true,
						})
					)
				);
				invalidateList();
				bumpTabRefresh();
				createSuccessNotice(
					sprintf(
						_n(
							'Successfully deleted %d review.',
							'Successfully deleted %d reviews.',
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
						__('Failed to delete review.', 'surecart'),
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
			bumpTabRefresh,
		]
	);

	const actions = useMemo(
		() =>
			buildReviewActions({
				navigation,
				handleApprove,
				handleReject,
				handleDelete,
			}),
		[navigation, handleApprove, handleReject, handleDelete]
	);

	return (
		<>
			<DataViewListLayout
				pageHeader={<ListHeader title={__('Reviews', 'surecart')} />}
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
						heading={__('Reviews', 'surecart')}
						description={__(
							'Approve, reject, and manage product reviews submitted by your customers.',
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
