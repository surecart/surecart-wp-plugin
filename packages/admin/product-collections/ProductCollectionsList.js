/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { useMemo, useCallback } from 'react';
import { Icon } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { trash, edit, external } from '@wordpress/icons';
import {
	DataViewListLayout,
	useDataViewState,
	ConfirmDeleteModal,
} from '../components/dataview-list';
import './product-collections-list-style.scss';

/**
 * No sortable columns in the original PHP table.
 * Map created to created_at for potential future sorting.
 */
const SORT_MAP = {
	created: 'created_at',
};

/**
 * Column width styles via DataViews layout.styles API.
 */
const LAYOUT_STYLES = {
	name: { width: '30%' },
	products_count: { width: '100px' },
};

/**
 * Default visible fields — mirrors PHP get_columns().
 */
const DEFAULT_FIELDS = ['name', 'products_count', 'description', 'created'];

/**
 * Get the collection edit URL.
 */
function getEditUrl(id) {
	return addQueryArgs('admin.php', {
		page: 'sc-product-collections',
		action: 'edit',
		id,
	});
}

/**
 * Get the products list URL filtered by collection.
 */
function getProductsUrl(collectionId) {
	return addQueryArgs('admin.php', {
		page: 'sc-products',
		sc_collection: collectionId,
	});
}

/**
 * Product Collections list DataView component.
 */
export default function ProductCollectionsList() {
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const {
		view,
		setView,
		records,
		hasResolved,
		paginationInfo,
		invalidateList,
	} = useDataViewState({
		entity: 'product-collection',
		defaultSort: { field: 'created', direction: 'desc' },
		sortMap: SORT_MAP,
		defaultFields: DEFAULT_FIELDS,
		layoutStyles: LAYOUT_STYLES,
		defaultStatus: null, // No tabs for collections.
		buildQueryArgs: () => ({}),
	});

	const fields = useMemo(
		() => [
			{
				id: 'name',
				label: __('Name', 'surecart'),
				enableSorting: false,
				enableGlobalSearch: true,
				render: ({ item }) => {
					return (
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 12px;
							`}
						>
							<div>
								<a
									href={getEditUrl(item?.id)}
									css={css`
										font-weight: 600;
										color: var(--sc-color-gray-900);
										text-decoration: none;
										&:hover {
											color: var(--sc-color-primary-500);
										}
									`}
								>
									{item?.name}
								</a>
							</div>
						</div>
					);
				},
			},
			{
				id: 'products_count',
				label: __('Products', 'surecart'),
				enableSorting: false,
				render: ({ item }) => (
					<a
						href={getProductsUrl(item?.id)}
						css={css`
							color: var(--sc-color-primary-500);
							text-decoration: none;
							&:hover {
								text-decoration: underline;
							}
						`}
					>
						{item?.products_count ?? 0}
					</a>
				),
			},
			{
				id: 'description',
				label: __('Description', 'surecart'),
				enableSorting: false,
				render: ({ item }) => {
					if (!item?.description) {
						return '-';
					}
					const stripped = item.description.replace(/<[^>]*>/g, '');
					return stripped.length > 50
						? stripped.substring(0, 50) + '...'
						: stripped;
				},
			},
			{
				id: 'created',
				label: __('Created', 'surecart'),
				enableSorting: false,
				render: ({ item }) => item?.created_at_date_time || '-',
			},
		],
		[]
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
							{
								throwOnError: true,
							}
						)
					)
				);
				// Re-fetch the list so deleted items disappear.
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
		() => [
			{
				id: 'edit',
				label: __('Edit', 'surecart'),
				icon: <Icon icon={edit} />,
				callback: ([item]) => {
					window.location.href = getEditUrl(item.id);
				},
			},
			{
				id: 'view',
				label: __('View Collection', 'surecart'),
				icon: <Icon icon={external} />,
				isEligible: (item) => !!item.permalink,
				callback: ([item]) => {
					window.open(item.permalink, '_blank');
				},
			},
			{
				id: 'delete',
				icon: <Icon icon={trash} />,
				label: __('Delete permanently', 'surecart'),
				isDestructive: true,
				supportsBulk: true,
				hideModalHeader: true,
				RenderModal: ({ items, closeModal }) => (
					<ConfirmDeleteModal
						items={items}
						closeModal={closeModal}
						onDelete={handleDelete}
						message={sprintf(
							_n(
								'Are you sure you want to permanently delete %d collection?',
								'Are you sure you want to permanently delete %d collections?',
								items.length,
								'surecart'
							),
							items.length
						)}
					/>
				),
			},
		],
		[handleDelete]
	);

	return (
		<DataViewListLayout
			data={records}
			fields={fields}
			view={view}
			onChangeView={setView}
			paginationInfo={paginationInfo}
			actions={actions}
			isLoading={!hasResolved}
		/>
	);
}
