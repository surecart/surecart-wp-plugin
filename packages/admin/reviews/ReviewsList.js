/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useMemo, useCallback } from 'react';
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
import useSiteContext from '../hooks/useSiteContext';
import useModernViewIntroProps from '../hooks/useModernViewIntroProps';
import useListMutation from '../hooks/useListMutation';
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

const reviewsQueryArgs = ({ view }) => buildReviewsQuery(view);

export default ({ navigation }) => {
	const { deleteEntityRecord, receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();
	const siteContext = useSiteContext();
	const introProps = useModernViewIntroProps();
	const { isMutating, run: runMutation } = useListMutation();

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
		buildQueryArgs: reviewsQueryArgs,
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

	// Use batch endpoints for status changes to avoid per-resource locks that delay the UI when processing many items.
	const mutateStatus = useCallback(
		(
			items,
			endpoint,
			nextStatus,
			instantMessage,
			queuedMessage,
			errorLabel
		) =>
			runMutation(
				async () => {
					if (items.length === 1) {
						const updated = await apiFetch({
							path: `/surecart/v1/reviews/${items[0].id}/${endpoint}`,
							method: 'PATCH',
						});
						// Prime the cache so the row's status badge flips
						// immediately, before the list re-fetches.
						receiveEntityRecords(
							'surecart',
							'review',
							{ ...updated, status: nextStatus },
							undefined,
							false
						);
						invalidateList();
						bumpTabRefresh();
						createSuccessNotice(instantMessage, {
							type: 'snackbar',
						});
						return;
					}
					await apiFetch({
						path: '/surecart/v1/batches',
						method: 'POST',
						data: {
							batch_operations: items.map((item) => ({
								http_method: 'PATCH',
								path: `/v1/reviews/${item.id}/${endpoint}`,
							})),
						},
					});
					invalidateList();
					bumpTabRefresh();
					createSuccessNotice(queuedMessage, { type: 'snackbar' });
				},
				{ errorMessage: errorLabel }
			),
		[
			runMutation,
			receiveEntityRecords,
			invalidateList,
			bumpTabRefresh,
			createSuccessNotice,
		]
	);

	const handleApprove = useCallback(
		(items) =>
			mutateStatus(
				items,
				'publish',
				'published',
				sprintf(
					/* translators: %d is the number of approved reviews. */
					_n(
						'Approved %d review.',
						'Approved %d reviews.',
						items.length,
						'surecart'
					),
					items.length
				),
				sprintf(
					/* translators: %d is the number of reviews queued for approval. */
					_n(
						'Queued %d review for approval. Refresh in a moment to see the result.',
						'Queued %d reviews for approval. Refresh in a moment to see the result.',
						items.length,
						'surecart'
					),
					items.length
				),
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
				sprintf(
					/* translators: %d is the number of rejected reviews. */
					_n(
						'Rejected %d review.',
						'Rejected %d reviews.',
						items.length,
						'surecart'
					),
					items.length
				),
				sprintf(
					/* translators: %d is the number of reviews queued for rejection. */
					_n(
						'Queued %d review for rejection. Refresh in a moment to see the result.',
						'Queued %d reviews for rejection. Refresh in a moment to see the result.',
						items.length,
						'surecart'
					),
					items.length
				),
				__('Failed to reject review.', 'surecart')
			),
		[mutateStatus]
	);

	const handleDelete = useCallback(
		(items) =>
			runMutation(
				async () => {
					if (items.length === 1) {
						// Single — direct call so core-data drops the row
						// from the cache instantly, no refresh needed.
						await deleteEntityRecord(
							'surecart',
							'review',
							items[0].id,
							{
								throwOnError: true,
							}
						);
						invalidateList();
						bumpTabRefresh();
						createSuccessNotice(__('Review deleted.', 'surecart'), {
							type: 'snackbar',
						});
						return;
					}
					// Bulk — one Batch API request. The platform processes
					// N DELETEs asynchronously; far kinder to rate limits
					// than N parallel browser requests (and avoids the
					// per-resource lock that approve/reject hits).
					await apiFetch({
						path: '/surecart/v1/batches',
						method: 'POST',
						data: {
							batch_operations: items.map((item) => ({
								http_method: 'DELETE',
								path: `/v1/reviews/${item.id}`,
							})),
						},
					});
					invalidateList();
					bumpTabRefresh();
					createSuccessNotice(
						sprintf(
							/* translators: %d is the number of reviews queued for deletion. */
							_n(
								'Queued %d review for deletion. Refresh in a moment to see the result.',
								'Queued %d reviews for deletion. Refresh in a moment to see the result.',
								items.length,
								'surecart'
							),
							items.length
						),
						{ type: 'snackbar' }
					);
				},
				{ errorMessage: __('Failed to delete review.', 'surecart') }
			),
		[
			runMutation,
			deleteEntityRecord,
			createSuccessNotice,
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
						{...siteContext}
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

			{introProps && <ModernViewIntroModal {...introProps} />}
		</>
	);
};
