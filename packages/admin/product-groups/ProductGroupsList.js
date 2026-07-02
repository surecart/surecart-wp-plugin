/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
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
	DismissibleInfo,
} from '../components/dataview-list';
import { submitBatchOperations } from '../util/batches';
import useSiteContext from '../hooks/useSiteContext';
import useModernViewIntroProps from '../hooks/useModernViewIntroProps';
import useListMutation from '../hooks/useListMutation';
import ListHeader from '../components/ListHeader';
import { buildGroupFields } from './list/fields';
import { buildGroupActions } from './list/actions';
import {
	buildGroupsQuery,
	GROUPS_DEFAULT_SORT,
	GROUPS_SORT_MAP,
} from './list/buildQuery';
import { GROUPS_URL_FILTERS } from './list/urlFilters';
import { useStatusTabs } from './list/useStatusTabs';
import './product-groups-list-style.scss';

const LAYOUT_STYLES = {
	name: { width: '35%' },
	products_count: { width: '15%' },
	status: { width: '15%' },
	created: { width: '20%' },
};

const DEFAULT_FIELDS = ['name', 'products_count', 'status', 'created'];
const PREFERENCE_KEY = 'product-groups-list-view';

const groupsQueryArgs = ({ view }) => buildGroupsQuery(view);

export default ({ navigation }) => {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();
	const siteContext = useSiteContext();
	const introProps = useModernViewIntroProps();
	const { isMutating, run: runMutation } = useListMutation();

	const defaultFields = useMemo(
		() => applyDefaultFieldsExtensions('product-groups', DEFAULT_FIELDS),
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
		entity: 'product-group',
		defaultSort: GROUPS_DEFAULT_SORT,
		sortMap: GROUPS_SORT_MAP,
		defaultFields,
		layoutStyles: LAYOUT_STYLES,
		preferenceKey: PREFERENCE_KEY,
		pageSlug: 'sc-product-groups',
		urlFilters: GROUPS_URL_FILTERS,
		buildQueryArgs: groupsQueryArgs,
	});

	const { tabs, activeValue, setTab } = useStatusTabs({
		view,
		setView,
	});

	const fields = useMemo(
		() => buildGroupFields({ navigation }),
		[navigation]
	);

	// Direct save for single, Batch API for bulk — same pattern as Products.
	const handleArchiveToggle = useCallback(
		(items) =>
			runMutation(
				async () => {
					if (items.length === 1) {
						const item = items[0];
						await saveEntityRecord(
							'surecart',
							'product-group',
							{ id: item.id, archived: !item.archived },
							{ throwOnError: true }
						);
					} else {
						await submitBatchOperations(
							items.map((item) => ({
								http_method: 'PATCH',
								path: `/v1/product_groups/${item.id}`,
								body: {
									product_group: {
										archived: !item.archived,
									},
								},
							}))
						);
					}
					invalidateList();
					createSuccessNotice(
						items.length === 1
							? items[0].archived
								? __('Upgrade group unarchived.', 'surecart')
								: __('Upgrade group archived.', 'surecart')
							: sprintf(
									/* translators: %d is the number of updated groups. */
									_n(
										'Updated %d upgrade group.',
										'Updated %d upgrade groups.',
										items.length,
										'surecart'
									),
									items.length
							  ),
						{ type: 'snackbar' }
					);
				},
				{
					errorMessage: __(
						'Failed to update upgrade group.',
						'surecart'
					),
				}
			),
		[runMutation, saveEntityRecord, invalidateList, createSuccessNotice]
	);

	const handleDelete = useCallback(
		(items) =>
			runMutation(
				async () => {
					if (items.length === 1) {
						await deleteEntityRecord(
							'surecart',
							'product-group',
							items[0].id,
							{ throwOnError: true }
						);
						invalidateList();
						createSuccessNotice(
							__('Upgrade group deleted.', 'surecart'),
							{ type: 'snackbar' }
						);
						return;
					}

					await submitBatchOperations(
						items.map((item) => ({
							http_method: 'DELETE',
							path: `/v1/product_groups/${item.id}`,
						}))
					);
					invalidateList();
					createSuccessNotice(
						sprintf(
							/* translators: %d is the number of deleted upgrade groups. */
							_n(
								'Deleted %d upgrade group.',
								'Deleted %d upgrade groups.',
								items.length,
								'surecart'
							),
							items.length
						),
						{ type: 'snackbar' }
					);
				},
				{
					errorMessage: __(
						'Failed to delete upgrade group.',
						'surecart'
					),
				}
			),
		[runMutation, deleteEntityRecord, createSuccessNotice, invalidateList]
	);

	const actions = useMemo(
		() =>
			buildGroupActions({
				navigation,
				handleArchiveToggle,
				handleDelete,
			}),
		[navigation, handleArchiveToggle, handleDelete]
	);

	return (
		<>
			<DataViewListLayout
				pageHeader={
					<>
						<ListHeader
							title={__('Upgrade Groups', 'surecart')}
							actionLabel={__('Add Upgrade Group', 'surecart')}
							actionHref={addQueryArgs('admin.php', {
								page: 'sc-product-groups',
								action: 'edit',
							})}
							onAction={() => navigation.goToCreate()}
						/>
						<DismissibleInfo
							id="product-groups-intro"
							title={__('What are Upgrade Groups?', 'surecart')}
						>
							{__(
								'An upgrade group is how you define upgrade and downgrade paths for your customers. It is based on products they have previously purchased.',
								'surecart'
							)}
						</DismissibleInfo>
					</>
				}
				statusSidebar={
					<StatusSidebar
						{...siteContext}
						heading={__('Upgrade Groups', 'surecart')}
						description={__(
							'Define the upgrade and downgrade paths customers see based on what they have already purchased.',
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
