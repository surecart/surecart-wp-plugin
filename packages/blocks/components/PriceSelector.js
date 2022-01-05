/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { useState, useEffect, Fragment } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';
import SelectPrice from './SelectPrice';
import { useSelect, dispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default ( { onSelect, createNew, ad_hoc, value, open = true } ) => {
	const [ query, setQuery ] = useState( null );
	const [ newModal, setNewModal ] = useState( false );

	const { products, loading } = useSelect(
		( select ) => {
			const queryArgs = [
				'root',
				'product',
				{ query, expand: [ 'prices' ], archived: false },
			];
			return {
				products: select( coreStore ).getEntityRecords( ...queryArgs ),
				loading: select( coreStore ).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[ query ]
	);

	// set prices when products are loaded.
	useEffect( () => {
		const prices = ( products || [] )
			.map( ( product ) => product?.prices?.data )
			.flat()
			.filter( ( price ) => price?.id );

		if ( prices ) {
			dispatch( coreStore ).receiveEntityRecords(
				'root',
				'price',
				prices,
				{ expand: [ 'product' ] }
			);
		}
	}, [ products ] );

	const onNew = () => {
		setNewModal( true );
	};

	return (
		<Fragment>
			<SelectPrice
				required
				css={ css`
					flex: 0 1 50%;
				` }
				value={ value }
				onNew={ createNew && onNew }
				open={ open }
				ad_hoc={ ad_hoc }
				products={ products }
				onQuery={ setQuery }
				onFetch={ () => setQuery( '' ) }
				loading={ loading }
				onSelect={ onSelect }
			/>
			{ newModal && (
				<Modal
					title="Create a product"
					isFullScreen={ true }
					css={ css`
						width: 90vw;
						min-height: 90vh;
					` }
					shouldCloseOnClickOutside={ false }
					onRequestClose={ () => setNewModal( false ) }
				>
					<p>Dialog for creating a new product</p>
					<Button isPrimary onClick={ () => setNewModal( false ) }>
						Create
					</Button>
					<Button isTertiary onClick={ () => setNewModal( false ) }>
						Cancel
					</Button>
				</Modal>
			) }
		</Fragment>
	);
};
