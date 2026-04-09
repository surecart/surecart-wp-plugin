/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Icon } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import ModelSelector from '../components/ModelSelector';
import { ScMenuItem, ScDivider } from '@surecart/components-react';
import { getQueryArgs } from '@wordpress/url';
import { DataViewListLayout, useDataViewState, ConfirmDeleteModal } from '../components/dataview-list';
import './product-list-style.scss';

/**
 * Read initial state from URL query params.
 * Supports: ?sc_collection=xxx (from Product Collections page), ?status=archived
 */
const URL_PARAMS = getQueryArgs( window.location.href );
const INITIAL_FILTERS = URL_PARAMS.sc_collection
	? { collectionId: URL_PARAMS.sc_collection }
	: {};
const INITIAL_STATUS = [ 'active', 'archived', 'all' ].includes( URL_PARAMS.status )
	? URL_PARAMS.status
	: 'active';

/**
 * Base URL for the products page (without dynamic query params).
 */
const BASE_PAGE = 'admin.php?page=sc-products';

/**
 * Sort field map — mirrors PHP get_sort_map().
 */
const SORT_MAP = {
	name: 'name',
	date: 'cataloged_at',
};

/**
 * Status tabs configuration.
 */
const STATUS_TABS = [
	{ value: 'active', label: __( 'Active', 'surecart' ) },
	{ value: 'archived', label: __( 'Archived', 'surecart' ) },
	{ value: 'all', label: __( 'All', 'surecart' ) },
];

/**
 * Column width styles via DataViews layout.styles API.
 * Replaces fragile CSS nth-child selectors.
 */
const LAYOUT_STYLES = {
	name: { width: '25%' },
	featured: { width: '60px' },
};

/**
 * Default visible fields.
 */
const DEFAULT_FIELDS = [
	'name',
	'price',
	'commission_amount',
	'quantity',
	'product_collections',
	'status',
	'featured',
	'date',
];

/**
 * URL helpers.
 */
function getEditUrl( id ) {
	return addQueryArgs( 'admin.php', { page: 'sc-products', action: 'edit', id } );
}

/**
 * Products list DataView component.
 */
export default function ProductsList() {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch( coreStore );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	// Tracks whether an inline action (archive/unarchive/duplicate) is in-flight.
	// Passed to isLoading so the table shows a loading state during mutations.
	const [ isMutating, setIsMutating ] = useState( false );

	// Reusable data view state hook.
	const {
		view,
		setView,
		status,
		setStatus,
		filters,
		setFilter,
		records,
		hasResolved,
		paginationInfo,
		invalidateList,
	} = useDataViewState( {
		entity: 'product',
		defaultSort: { field: 'date', direction: 'desc' },
		sortMap: SORT_MAP,
		defaultFields: DEFAULT_FIELDS,
		layoutStyles: LAYOUT_STYLES,
		initialFilters: INITIAL_FILTERS,
		defaultStatus: INITIAL_STATUS,
		buildQueryArgs: ( { status: currentStatus, filters: currentFilters } ) => {
			const args = {
				// Expand relations needed for the list columns.
				expand: [
					'product_collections',
					'commission_structure',
				],
			};

			// Archive status filter.
			if ( currentStatus === 'active' ) {
				args.archived = false;
			} else if ( currentStatus === 'archived' ) {
				args.archived = true;
			}

			// Collection filter.
			if ( currentFilters.collectionId ) {
				args.product_collection_ids = [ currentFilters.collectionId ];
			}

			return args;
		},
	} );

	// ─── Sync state to URL bar ───
	useEffect( () => {
		const params = { page: 'sc-products' };

		// Only add status param when not the default.
		if ( status && status !== 'active' ) {
			params.status = status;
		}

		// Collection filter.
		if ( filters.collectionId ) {
			params.sc_collection = filters.collectionId;
		}

		const url = addQueryArgs( 'admin.php', params );
		window.history.replaceState( null, '', url );
	}, [ status, filters.collectionId ] );

	const collectionId = filters.collectionId || '';

	// ─── Field definitions ───
	const fields = useMemo(
		() => [
			{
				id: 'name',
				label: __( 'Name', 'surecart' ),
				enableSorting: true,
				enableGlobalSearch: true,
				render: ( { item } ) => (
					<div
						css={ css`
							display: flex;
							align-items: center;
							gap: 12px;
						` }
					>
						{ item?.line_item_image?.src && item?.line_item_image?.type !== 'fallback' ? (
							<img
								src={ item.line_item_image.src }
								alt={ item?.name }
								css={ css`
									width: 40px;
									height: 40px;
									border: var( --sc-input-border );
									border-radius: var( --sc-border-radius-medium );
									box-shadow: var( --sc-shadow-small );
									object-fit: cover;
									flex: 0 0 40px;
								` }
							/>
						) : (
							<div
								css={ css`
									width: 40px;
									height: 40px;
									background: #f3f3f3;
									display: flex;
									align-items: center;
									justify-content: center;
									border: var( --sc-input-border );
									border-radius: var( --sc-border-radius-medium );
									box-shadow: var( --sc-shadow-small );
									flex: 0 0 40px;
								` }
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									style={ { width: '18px', height: '18px' } }
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={ 2 }
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
						) }
						<div>
							<a
								href={ getEditUrl( item?.id ) }
								css={ css`
									font-weight: 600;
									color: var( --sc-color-gray-900 );
									text-decoration: none;
									&:hover {
										color: var( --sc-color-primary-500 );
									}
								` }
							>
								{ item?.name }
							</a>
						</div>
					</div>
				),
			},
			{
				id: 'price',
				label: __( 'Price', 'surecart' ),
				enableSorting: false,
				render: ( { item } ) => item?.range_display_amount || '-',
			},
			{
				id: 'commission_amount',
				label: __( 'Commission', 'surecart' ),
				enableSorting: false,
				render: ( { item } ) => item?.commission_structure?.commission_amount || '-',
			},
			{
				id: 'quantity',
				label: __( 'Quantity', 'surecart' ),
				enableSorting: false,
				render: ( { item } ) => {
					if ( ! item?.stock_enabled ) {
						return '\u221E';
					}
					return sprintf(
						/* translators: %d is the number of available stock */
						__( '%d Available', 'surecart' ),
						item?.available_stock || 0
					);
				},
			},
			{
				id: 'product_collections',
				label: __( 'Collections', 'surecart' ),
				enableSorting: false,
				render: ( { item } ) => {
					const itemCollections = item?.product_collections?.data || [];
					if ( ! itemCollections.length ) {
						return '-';
					}
					return (
						<div
							css={ css`
								display: flex;
								flex-wrap: wrap;
								gap: 4px;
							` }
						>
							{ itemCollections.map( ( collection ) => (
								<sc-tag key={ collection.id } type="info">
									{ collection.name }
								</sc-tag>
							) ) }
						</div>
					);
				},
			},
			{
				id: 'status',
				label: __( 'Product Page', 'surecart' ),
				enableSorting: false,
				render: ( { item } ) => {
					const isPublished = item?.status === 'published';
					return (
						<sc-tag type={ isPublished ? 'success' : '' }>
							{ isPublished
								? __( 'Published', 'surecart' )
								: __( 'Draft', 'surecart' ) }
						</sc-tag>
					);
				},
			},
			{
				id: 'featured',
				label: __( 'Featured', 'surecart' ),
				enableSorting: false,
				render: ( { item } ) => (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill={ item?.featured ? 'currentColor' : 'none' }
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
					</svg>
				),
			},
			{
				id: 'date',
				label: __( 'Created', 'surecart' ),
				enableSorting: true,
				render: ( { item } ) => {
					if ( ! item?.cataloged_at ) {
						return '-';
					}
					const date = new Date( item.cataloged_at * 1000 );
					return date.toLocaleDateString( undefined, {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
					} );
				},
			},
		],
		[]
	);

	// ─── Action handlers ───
	const handleArchiveToggle = useCallback(
		async ( items ) => {
			setIsMutating( true );
			try {
				await Promise.all(
					items.map( ( item ) =>
						saveEntityRecord(
							'surecart',
							'product',
							{ id: item.id, archived: ! item.archived },
							{ throwOnError: true }
						)
					)
				);
				// Re-fetch the list so archived items disappear from the current tab.
				invalidateList();
				createSuccessNotice(
					items.length === 1
						? items[ 0 ].archived
							? __( 'Product unarchived.', 'surecart' )
							: __( 'Product archived.', 'surecart' )
						: sprintf(
								_n( '%d product updated.', '%d products updated.', items.length, 'surecart' ),
								items.length
						  ),
					{ type: 'snackbar' }
				);
			} catch ( error ) {
				createErrorNotice(
					error?.message || __( 'Failed to update product.', 'surecart' ),
					{ type: 'snackbar' }
				);
			} finally {
				setIsMutating( false );
			}
		},
		[ saveEntityRecord, createSuccessNotice, createErrorNotice, invalidateList ]
	);

	const handleDuplicate = useCallback(
		async ( items ) => {
			setIsMutating( true );
			try {
				await Promise.all(
					items.map( ( item ) =>
						apiFetch( {
							path: `/surecart/v1/products/${ item.id }/duplicate`,
							method: 'POST',
						} )
					)
				);
				// Re-fetch the list so the new duplicate appears.
				invalidateList();
				createSuccessNotice( __( 'Product duplicated successfully.', 'surecart' ), { type: 'snackbar' } );
			} catch ( error ) {
				createErrorNotice(
					error?.message || __( 'Failed to duplicate product.', 'surecart' ),
					{ type: 'snackbar' }
				);
			} finally {
				setIsMutating( false );
			}
		},
		[ createSuccessNotice, createErrorNotice, invalidateList ]
	);

	const handleDelete = useCallback(
		async ( items ) => {
			try {
				await Promise.all(
					items.map( ( item ) =>
						deleteEntityRecord( 'surecart', 'product', item.id, { throwOnError: true } )
					)
				);
				// Re-fetch the list so deleted items disappear.
				invalidateList();
				createSuccessNotice(
					sprintf(
						_n( 'Successfully deleted %d product.', 'Successfully deleted %d products.', items.length, 'surecart' ),
						items.length
					),
					{ type: 'snackbar' }
				);
			} catch ( error ) {
				createErrorNotice(
					error?.message || __( 'Failed to delete products.', 'surecart' ),
					{ type: 'snackbar' }
				);
			}
		},
		[ deleteEntityRecord, createSuccessNotice, createErrorNotice, invalidateList ]
	);

	// ─── Action definitions ───
	const actions = useMemo(
		() => [
			{
				id: 'edit',
				label: __( 'Edit', 'surecart' ),
				icon: <Icon icon={ edit } />,
				callback: ( [ item ] ) => {
					window.location.href = getEditUrl( item.id );
				},
			},
			{
				id: 'archive',
				label: __( 'Archive', 'surecart' ),
				icon: <Icon icon={ archive } />,
				isEligible: ( item ) => ! item.archived,
				supportsBulk: true,
				callback: ( items ) => handleArchiveToggle( items ),
			},
			{
				id: 'unarchive',
				label: __( 'Un-Archive', 'surecart' ),
				icon: <Icon icon={ archive } />,
				isEligible: ( item ) => !! item.archived,
				supportsBulk: true,
				callback: ( items ) => handleArchiveToggle( items ),
			},
			{
				id: 'view',
				label: __( 'View Product', 'surecart' ),
				icon: <Icon icon={ external } />,
				isEligible: ( item ) => !! item.permalink,
				callback: ( [ item ] ) => {
					window.open( item.permalink, '_blank' );
				},
			},
			{
				id: 'duplicate',
				label: __( 'Duplicate', 'surecart' ),
				icon: <Icon icon={ copy } />,
				callback: ( items ) => handleDuplicate( items ),
			},
			{
				id: 'delete',
				icon: <Icon icon={ trash } />,
				label: __( 'Delete permanently', 'surecart' ),
				isDestructive: true,
				supportsBulk: true,
				hideModalHeader: true,
				RenderModal: ( { items, closeModal } ) => (
					<ConfirmDeleteModal
						items={ items }
						closeModal={ closeModal }
						onDelete={ handleDelete }
						message={ sprintf(
							_n(
								'Are you sure you want to permanently delete %d product?',
								'Are you sure you want to permanently delete %d products?',
								items.length,
								'surecart'
							),
							items.length
						) }
					/>
				),
			},
		],
		[ handleArchiveToggle, handleDuplicate, handleDelete ]
	);

	// ─── Collection filter control ───
	const collectionFilter = (
		<ModelSelector
			name="product-collection"
			placeholder={ __( 'All Product Collections', 'surecart' ) }
			searchPlaceholder={ __( 'Search collections…', 'surecart' ) }
			value={ collectionId }
			onSelect={ ( id ) => {
				setFilter( 'collectionId', id === collectionId ? '' : id );
			} }
			style={ { width: '100%' } }
			prefix={
				collectionId ? (
					<>
						<ScMenuItem
							onClick={ () => {
								setFilter( 'collectionId', '' );
							} }
						>
							{ __( 'All Product Collections', 'surecart' ) }
						</ScMenuItem>
						<ScDivider style={ { '--spacing': 'var(--sc-spacing-x-small)' } } />
					</>
				) : null
			}
		/>
	);

	return (
		<DataViewListLayout
			tabs={ STATUS_TABS }
			activeTab={ status }
			onTabChange={ setStatus }
			headerControls={ collectionFilter }
			data={ records }
			fields={ fields }
			view={ view }
			onChangeView={ setView }
			paginationInfo={ paginationInfo }
			actions={ actions }
			isLoading={ ! hasResolved }
			isMutating={ isMutating }
		/>
	);
}
