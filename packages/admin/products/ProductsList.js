/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { DataViews } from '@wordpress/dataviews/wp';
import {
	useEntityRecords,
	store as coreStore,
} from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { useMemo, useState, useCallback } from 'react';
import {
	Button,
	__experimentalText as Text,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	Icon,
} from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import ModelSelector from '../components/ModelSelector';
import { ScMenuItem, ScDivider } from '@surecart/components-react';
import './product-list-style.scss';

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
 * Get the product edit URL.
 *
 * @param {string} id Product ID.
 * @return {string} Edit URL.
 */
function getEditUrl( id ) {
	return addQueryArgs( 'admin.php', {
		page: 'sc-products',
		action: 'edit',
		id,
	} );
}

/**
 * Get the product duplicate URL.
 *
 * @param {string} id Product ID.
 * @return {string} Duplicate URL.
 */
function getDuplicateUrl( id ) {
	return addQueryArgs( 'admin.php', {
		page: 'sc-products',
		action: 'duplicate',
		id,
		_wpnonce: window.scData?.nonces?.duplicate_product || '',
	} );
}

/**
 * Get the archive toggle URL.
 *
 * @param {string} id Product ID.
 * @return {string} Archive toggle URL.
 */
function getArchiveToggleUrl( id ) {
	return addQueryArgs( 'admin.php', {
		page: 'sc-products',
		action: 'toggle_archive',
		id,
		_wpnonce: window.scData?.nonces?.archive_model || '',
	} );
}

/**
 * Products list DataView component.
 */
export default function ProductsList() {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch( coreStore );
	const { createSuccessNotice, createErrorNotice } =
		useDispatch( noticesStore );

	// Status tab state.
	const [ status, setStatus ] = useState( 'active' );

	// Product collection filter state.
	const [ collectionId, setCollectionId ] = useState( '' );

	// DataView view state.
	const [ view, setView ] = useState( {
		type: 'table',
		perPage: 20,
		page: 1,
		sort: {
			field: 'date',
			direction: 'desc',
		},
		search: '',
		filters: [],
		layout: {
			primaryField: 'name',
		},
		fields: [
			'name',
			'price',
			'quantity',
			'product_collections',
			'status',
			'featured',
			'date',
		],
	} );

	// Build query args from view state.
	const queryArgs = useMemo( () => {
		const sortField = view.sort?.field
			? SORT_MAP[ view.sort.field ] || view.sort.field
			: 'cataloged_at';
		const sortDir = view.sort?.direction || 'desc';

		const args = {
			per_page: view.perPage,
			page: view.page,
			sort: `${ sortField }:${ sortDir }`,
		};

		// Search query.
		if ( view.search ) {
			args.query = view.search;
		}

		// Archive status filter.
		if ( status === 'active' ) {
			args.archived = false;
		} else if ( status === 'archived' ) {
			args.archived = true;
		}
		// 'all' sends no archived param.

		// Collection filter.
		if ( collectionId ) {
			args.product_collection_ids = [ collectionId ];
		}

		return args;
	}, [ view, status, collectionId ] );

	// Fetch products.
	const {
		records: products,
		hasResolved,
		totalItems,
		totalPages,
	} = useEntityRecords( 'surecart', 'product', queryArgs );

	const paginationInfo = useMemo(
		() => ( {
			totalItems,
			totalPages,
		} ),
		[ totalItems, totalPages ]
	);

	// Field definitions — mirrors PHP get_columns().
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
						{ item?.featured_product_media?.media?.url ? (
							<img
								src={ item.featured_product_media.media.url }
								alt={ item?.name }
								css={ css`
									width: 40px;
									height: 40px;
									border: var( --sc-input-border );
									border-radius: var(
										--sc-border-radius-medium
									);
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
									border-radius: var(
										--sc-border-radius-medium
									);
									box-shadow: var( --sc-shadow-small );
									flex: 0 0 40px;
								` }
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									style={ {
										width: '18px',
										height: '18px',
									} }
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
										color: var(
											--sc-color-primary-500
										);
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
				render: ( { item } ) => {
					return item?.range_display_amount || '-';
				},
			},
			{
				id: 'commission_amount',
				label: __( 'Commission', 'surecart' ),
				enableSorting: false,
				render: ( { item } ) => {
					return item?.commission_structure?.commission_amount || '-';
				},
			},
			{
				id: 'quantity',
				label: __( 'Quantity', 'surecart' ),
				enableSorting: false,
				render: ( { item } ) => {
					if ( ! item?.stock_enabled ) {
						return '\u221E'; // infinity symbol
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
					const itemCollections =
						item?.product_collections?.data || [];
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
				render: ( { item } ) => {
					return (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill={
								item?.featured ? 'currentColor' : 'none'
							}
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
						</svg>
					);
				},
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

	/**
	 * Handle archive toggle via API.
	 */
	const handleArchiveToggle = useCallback(
		async ( items ) => {
			try {
				await Promise.all(
					items.map( ( item ) =>
						saveEntityRecord(
							'surecart',
							'product',
							{
								id: item.id,
								archived: ! item.archived,
							},
							{ throwOnError: true }
						)
					)
				);

				createSuccessNotice(
					items.length === 1
						? items[ 0 ].archived
							? __( 'Product unarchived.', 'surecart' )
							: __( 'Product archived.', 'surecart' )
						: sprintf(
								/* translators: %d is the number of products */
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
			} catch ( error ) {
				createErrorNotice(
					error?.message ||
						__( 'Failed to update product.', 'surecart' ),
					{ type: 'snackbar' }
				);
			}
		},
		[ saveEntityRecord, createSuccessNotice, createErrorNotice ]
	);

	/**
	 * Handle product duplication via API.
	 */
	const handleDuplicate = useCallback(
		async ( items ) => {
			try {
				await Promise.all(
					items.map( ( item ) =>
						apiFetch( {
							path: `/surecart/v1/products/${ item.id }/duplicate`,
							method: 'POST',
						} )
					)
				);

				createSuccessNotice(
					__( 'Product duplicated successfully.', 'surecart' ),
					{ type: 'snackbar' }
				);

				// Refresh by slightly tweaking view to trigger re-fetch.
				setView( ( prev ) => ( { ...prev } ) );
			} catch ( error ) {
				createErrorNotice(
					error?.message ||
						__( 'Failed to duplicate product.', 'surecart' ),
					{ type: 'snackbar' }
				);
			}
		},
		[ createSuccessNotice, createErrorNotice ]
	);

	/**
	 * Handle bulk delete.
	 */
	const handleDelete = useCallback(
		async ( items ) => {
			try {
				await Promise.all(
					items.map( ( item ) =>
						deleteEntityRecord( 'surecart', 'product', item.id, {
							throwOnError: true,
						} )
					)
				);

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
			} catch ( error ) {
				createErrorNotice(
					error?.message ||
						__( 'Failed to delete products.', 'surecart' ),
					{ type: 'snackbar' }
				);
			}
		},
		[ deleteEntityRecord, createSuccessNotice, createErrorNotice ]
	);

	// Action definitions — mirrors PHP getRowActions().
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
					<VStack>
						<Text>
							{ sprintf(
								_n(
									'Are you sure you want to permanently delete %d product?',
									'Are you sure you want to permanently delete %d products?',
									items.length,
									'surecart'
								),
								items.length
							) }
						</Text>
						<HStack justify="end">
							<Button
								variant="tertiary"
								onClick={ closeModal }
							>
								{ __( 'Cancel', 'surecart' ) }
							</Button>
							<Button
								variant="primary"
								isDestructive
								onClick={ () => {
									handleDelete( items );
									closeModal();
								} }
							>
								{ __( 'Delete', 'surecart' ) }
							</Button>
						</HStack>
					</VStack>
				),
			},
		],
		[ handleArchiveToggle, handleDuplicate, handleDelete ]
	);

	return (
		<div className="sc-products-dataview-wrapper">
			{ /* Status Tabs + Collection Filter */ }
			<div
				css={ css`
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16px;
					margin-top: 12px;
					margin-bottom: 16px;
					flex-wrap: wrap;
				` }
			>
				<ul
					css={ css`
						display: flex;
						gap: 0;
						margin: 0;
						padding: 0;
						list-style: none;
						border-bottom: 1px solid #c3c4c7;
					` }
				>
					{ STATUS_TABS.map( ( tab ) => (
						<li
							key={ tab.value }
							css={ css`
								margin: 0 0 -1px 0;
							` }
						>
							<a
								href={ `#${ tab.value }` }
								onClick={ ( e ) => {
									e.preventDefault();
									setStatus( tab.value );
									setView( ( prev ) => ( {
										...prev,
										page: 1,
									} ) );
								} }
								css={ css`
									display: inline-block;
									padding: 6px 12px;
									text-decoration: none;
									font-size: 14px;
									font-weight: ${ status === tab.value ? '600' : '400' };
									color: ${ status === tab.value
										? '#1d2327'
										: '#646970' };
									border-bottom: ${ status === tab.value
										? '2px solid #1d2327'
										: '2px solid transparent' };
									transition: color 0.15s ease;
									&:hover {
										color: #1d2327;
									}
									&:focus {
										outline: none;
										color: #1d2327;
									}
								` }
							>
								{ tab.label }
							</a>
						</li>
					) ) }
				</ul>

				{ /* Collection Filter */ }
				<div
					css={ css`
						min-width: 240px;
					` }
				>
					<ModelSelector
						name="product-collection"
						placeholder={ __( 'All Product Collections', 'surecart' ) }
						searchPlaceholder={ __( 'Search collections…', 'surecart' ) }
						value={ collectionId }
						onSelect={ ( id ) => {
							setCollectionId( id === collectionId ? '' : id );
							setView( ( prev ) => ( {
								...prev,
								page: 1,
							} ) );
						} }
						style={ { width: '100%' } }
						prefix={
							collectionId ? (
								<>
									<ScMenuItem
										onClick={ () => {
											setCollectionId( '' );
											setView( ( prev ) => ( {
												...prev,
												page: 1,
											} ) );
										} }
									>
										{ __( 'All Product Collections', 'surecart' ) }
									</ScMenuItem>
									<ScDivider style={ { '--spacing': 'var(--sc-spacing-x-small)' } } />
								</>
							) : null
						}
					/>
				</div>
			</div>

			{ /* DataView Table */ }
			<div
				css={ css`
					background: var(
						--sc-card-background-color,
						var( --sc-color-white )
					);
					border: 1px solid
						var(
							--sc-card-border-color,
							var( --sc-color-gray-300 )
						);
					border-radius: var( --sc-input-border-radius-medium );
					box-shadow: var( --sc-shadow-small );
				` }
			>
				<DataViews
					data={ products || [] }
					fields={ fields }
					view={ view }
					onChangeView={ setView }
					paginationInfo={ paginationInfo }
					supportedLayouts={ [ 'table' ] }
					defaultLayouts={ {
						table: {
							layout: {
								primaryField: 'name',
							},
						},
					} }
					isLoading={ ! hasResolved }
					actions={ actions }
					hasBulkActions={ true }
				/>
			</div>
		</div>
	);
}
