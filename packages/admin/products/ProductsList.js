/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { Icon } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import {
	trash,
	copy,
	archive,
	edit,
	external,
	starFilled,
	starEmpty,
} from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import { ScTag, ScTooltip } from '@surecart/components-react';
import {
	DataViewListLayout,
	useDataViewState,
	ConfirmDeleteModal,
} from '../components/dataview-list';
import ListHeader from '../components/ListHeader';
import ProductThumbnail from '../components/ProductThumbnail';
import useProductIntegrations from './hooks/useProductIntegrations';
import { useHistory } from '../router';
import './product-list-style.scss';

const STATUS_ELEMENTS = [
	{ value: 'active', label: __('Active', 'surecart') },
	{ value: 'archived', label: __('Archived', 'surecart') },
	{ value: 'all', label: __('All', 'surecart') },
];

const SORT_MAP = {
	name: 'name',
	created_at: 'cataloged_at',
};

const LAYOUT_STYLES = {
	name: { width: '25%' },
	price: { width: '7%' },
	commission_amount: { width: '8%' },
	quantity: { width: '4%' },
	integrations: { width: '10%' },
	product_collections: { width: '10%' },
	status: { width: '6%' },
	featured: { width: '5%' },
	created_at: { width: '10%' },
};

const DEFAULT_FIELDS = ['name', 'status', 'price', 'product_collections'];
const PREFERENCE_KEY = 'products-list-view';

function getEditUrl(id) {
	return addQueryArgs('admin.php', {
		page: 'sc-products',
		action: 'edit',
		id,
	});
}

export default function ProductsList({ navigation }) {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const [isMutating, setIsMutating] = useState(false);

	// Collections list for the filter dropdown.
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

	// Seed filters from URL on mount — supports ?status= and ?sc_collection=.
	// Read inside the component so remount (e.g. after edit) picks up URL changes.
	const initialViewFilters = useMemo(() => {
		const urlParams = getQueryArgs(window.location.href);
		const filters = [];
		if (urlParams.status === 'archived' || urlParams.status === 'all') {
			filters.push({
				field: 'archive_status',
				operator: 'is',
				value: urlParams.status,
			});
		}
		if (urlParams.sc_collection) {
			filters.push({
				field: 'product_collections',
				operator: 'isAny',
				value: [urlParams.sc_collection],
			});
		}
		return filters;
	}, []);

	const {
		view,
		setView,
		records,
		hasResolved,
		paginationInfo,
		invalidateList,
	} = useDataViewState({
		entity: 'product',
		defaultSort: { field: 'created_at', direction: 'desc' },
		sortMap: SORT_MAP,
		defaultFields: DEFAULT_FIELDS,
		layoutStyles: LAYOUT_STYLES,
		initialViewFilters,
		preferenceKey: PREFERENCE_KEY,
		buildQueryArgs: ({ view: currentView }) => {
			const args = {
				expand: ['product_collections', 'commission_structure'],
			};

			// Status filter — default to active when absent.
			const statusValue = currentView.filters?.find(
				(f) => f.field === 'archive_status'
			)?.value;
			if (statusValue === 'archived') {
				args.archived = true;
			} else if (statusValue !== 'all') {
				args.archived = false;
			}

			// Collection filter.
			const collectionIds = currentView.filters?.find(
				(f) => f.field === 'product_collections'
			)?.value;
			if (collectionIds?.length) {
				args.product_collection_ids = collectionIds;
			}

			return args;
		},
	});

	// Gate the integrations fetch on column visibility — three round-trips,
	// column is hidden by default.
	const integrationsEnabled = view.fields?.includes('integrations') ?? false;
	const { integrationsByProduct, providers, itemLabels } =
		useProductIntegrations(records, integrationsEnabled);

	// Mirror the two URL-facing filters back to the query string so the list
	// is bookmarkable. Defaults (status=active, no collection) stay out of
	// the URL on purpose — "keep it minimum".
	const history = useHistory();
	useEffect(() => {
		const statusValue = view.filters?.find(
			(f) => f.field === 'archive_status'
		)?.value;
		const collectionId = view.filters?.find(
			(f) => f.field === 'product_collections'
		)?.value?.[0];

		const params = { page: 'sc-products' };
		if (statusValue && statusValue !== 'active') {
			params.status = statusValue;
		}
		if (collectionId) {
			params.sc_collection = collectionId;
		}
		history.replace(params);
	}, [view.filters, history]);

	const fields = useMemo(
		() => [
			// Not a visible column — just drives the filter dropdown.
			{
				id: 'archive_status',
				label: __('Archive status', 'surecart'),
				enableSorting: false,
				enableHiding: false,
				filterBy: { operators: ['is'] },
				elements: STATUS_ELEMENTS,
				render: () => null,
			},
			{
				id: 'name',
				label: __('Name', 'surecart'),
				enableSorting: true,
				enableGlobalSearch: true,
				render: ({ item }) => (
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 12px;
							min-width: 0;
							white-space: normal;
						`}
					>
						<ProductThumbnail product={item} />
						<div
							css={css`
								min-width: 0;
								overflow: hidden;
							`}
						>
							<a
								href={getEditUrl(item?.id)}
								onClick={(e) => {
									e.preventDefault();
									navigation.goToEdit(item?.id);
								}}
								css={css`
									font-weight: 600;
									color: var(--sc-color-gray-900);
									text-decoration: none;
									word-break: break-word;
									&:hover {
										color: var(--sc-color-primary-500);
									}
								`}
							>
								{item?.name}
							</a>
						</div>
					</div>
				),
			},
			{
				id: 'price',
				label: __('Price', 'surecart'),
				enableSorting: false,
				render: ({ item }) => item?.range_display_amount || '-',
			},
			{
				id: 'commission_amount',
				label: __('Commission', 'surecart'),
				enableSorting: false,
				render: ({ item }) =>
					item?.commission_structure?.commission_amount || '-',
			},
			{
				id: 'quantity',
				label: __('Quantity', 'surecart'),
				enableSorting: false,
				render: ({ item }) => {
					if (!item?.stock_enabled) return '\u221E';
					return sprintf(
						/* translators: %d is the number of available stock */
						__('%d Available', 'surecart'),
						item?.available_stock || 0
					);
				},
			},
			{
				id: 'integrations',
				label: __('Integrations', 'surecart'),
				enableSorting: false,
				render: ({ item }) => {
					const itemIntegrations =
						integrationsByProduct[item?.id] || [];
					if (!itemIntegrations.length) return '-';
					return (
						<div
							css={css`
								display: flex;
								flex-wrap: wrap;
								gap: 4px;
							`}
						>
							{itemIntegrations.map((integration) => {
								const provider =
									providers[integration.provider];
								const label =
									itemLabels[integration.integration_id] ||
									provider?.label ||
									integration.provider;
								return provider?.logo ? (
									<ScTooltip
										key={integration.id}
										text={label}
										css={css`
											display: inline-flex;
										`}
									>
										<img
											src={provider.logo}
											alt={label}
											css={css`
												width: 20px;
												height: 20px;
												flex: 0 0 20px;
												cursor: help;
											`}
										/>
									</ScTooltip>
								) : (
									<ScTag key={integration.id} type="info">
										{label}
									</ScTag>
								);
							})}
						</div>
					);
				},
			},
			{
				id: 'product_collections',
				label: __('Collections', 'surecart'),
				enableSorting: false,
				filterBy: { operators: ['isAny'] },
				elements: collectionElements,
				render: ({ item }) => {
					const itemCollections =
						item?.product_collections?.data || [];
					if (!itemCollections.length) return '-';
					return (
						<div
							css={css`
								display: flex;
								flex-wrap: wrap;
								gap: 4px;
							`}
						>
							{itemCollections.map((collection) => (
								<span key={collection.id}>
									{collection.name}
								</span>
							))}
						</div>
					);
				},
			},
			{
				id: 'status',
				label: __('Status', 'surecart'),
				enableSorting: false,
				render: ({ item }) => {
					const isPublished = item?.status === 'published';
					return (
						<ScTag type={isPublished ? 'success' : ''}>
							{isPublished
								? __('Published', 'surecart')
								: __('Draft', 'surecart')}
						</ScTag>
					);
				},
			},
			{
				id: 'featured',
				label: __('Featured', 'surecart'),
				enableSorting: false,
				render: ({ item }) => (
					<Icon
						icon={item?.featured ? starFilled : starEmpty}
						size={18}
					/>
				),
			},
			{
				id: 'created_at',
				label: __('Created', 'surecart'),
				enableSorting: true,
				render: ({ item }) => item?.created_at_date || '-',
			},
		],
		[
			collectionElements,
			integrationsByProduct,
			providers,
			itemLabels,
			navigation,
		]
	);

	const handleArchiveToggle = useCallback(
		async (items) => {
			setIsMutating(true);
			try {
				await Promise.all(
					items.map((item) =>
						saveEntityRecord(
							'surecart',
							'product',
							{ id: item.id, archived: !item.archived },
							{ throwOnError: true }
						)
					)
				);
				invalidateList();
				createSuccessNotice(
					items.length === 1
						? items[0].archived
							? __('Product unarchived.', 'surecart')
							: __('Product archived.', 'surecart')
						: sprintf(
								_n(
									'%d product updated.',
									'%d products updated.',
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

				// Rethrow so ConfirmDeleteModal keeps itself open on failure.
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
		() => [
			{
				id: 'edit',
				label: __('Edit', 'surecart'),
				icon: <Icon icon={edit} />,
				isPrimary: true,
				callback: ([item]) => navigation.goToEdit(item.id),
			},
			{
				id: 'archive',
				label: __('Archive', 'surecart'),
				icon: <Icon icon={archive} />,
				isEligible: (item) => !item.archived,
				supportsBulk: true,
				callback: (items) => handleArchiveToggle(items),
			},
			{
				id: 'unarchive',
				label: __('Un-Archive', 'surecart'),
				icon: <Icon icon={archive} />,
				isEligible: (item) => !!item.archived,
				supportsBulk: true,
				callback: (items) => handleArchiveToggle(items),
			},
			{
				id: 'view',
				label: __('View Product', 'surecart'),
				isPrimary: true,
				icon: <Icon icon={external} />,
				isEligible: (item) => !!item.permalink,
				callback: ([item]) => window.open(item.permalink, '_blank'),
			},
			{
				id: 'duplicate',
				label: __('Duplicate', 'surecart'),
				icon: <Icon icon={copy} />,
				// Single-item only — bulk duplicate is not supported.
				callback: ([item]) => handleDuplicate([item]),
			},
			{
				id: 'delete',
				icon: <Icon icon={trash} />,
				label: __('Delete permanently', 'surecart'),
				isDestructive: true,
				supportsBulk: true,
				RenderModal: ({ items, closeModal }) => (
					<ConfirmDeleteModal
						items={items}
						closeModal={closeModal}
						onDelete={handleDelete}
						message={sprintf(
							_n(
								'Are you sure you want to permanently delete %d product?',
								'Are you sure you want to permanently delete %d products?',
								items.length,
								'surecart'
							),
							items.length
						)}
					/>
				),
			},
		],
		[handleArchiveToggle, handleDuplicate, handleDelete, navigation]
	);

	return (
		<>
			<ListHeader
				title={__('Products', 'surecart')}
				actionLabel={__('Add Product', 'surecart')}
				actionHref={addQueryArgs('admin.php', {
					page: 'sc-products',
					action: 'edit',
				})}
				onAction={() => navigation.goToCreate()}
			/>
			<DataViewListLayout
				data={records}
				fields={fields}
				view={view}
				onChangeView={setView}
				paginationInfo={paginationInfo}
				actions={actions}
				isLoading={!hasResolved}
				isMutating={isMutating}
			/>
		</>
	);
}
