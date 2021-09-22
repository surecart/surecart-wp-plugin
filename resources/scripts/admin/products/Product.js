/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';

import { STORE_KEY as NOTICES_STORE_KEY } from '../store/notices';
import { STORE_KEY as UI_STORE_KEY } from '../store/ui';
import { STORE_KEY as DATA_STORE_KEY } from '../store/data';

// template
import Template from '../templates/SingleModel';

// components
import SaveButton from './components/SaveButton';
import ProductActionsDropdown from './components/ProductActionsDropdown';
import FlashError from '../components/FlashError';

// modules
import Details from './modules/Details';
import Prices from './modules/Prices';

// parts
import Sidebar from './Sidebar';

// hooks
import useSnackbar from '../hooks/useSnackbar';
import useProductData from './hooks/useProductData';

// hocs
import withConfirm from '../hocs/withConfirm';

export default withConfirm( ( { setConfirm, noticeUI } ) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	const {
		product,
		toggleArchiveModel,
		prices,
		loading,
		status,
		isSaving,
	} = useProductData();

	const onSubmit = async ( e ) => {
		e.preventDefault();
		if ( ! prices.some( ( price ) => ! price.archived ) ) {
			return handlePricesError();
		}
		dispatch( DATA_STORE_KEY ).saveModel( 'products', {
			with: [ 'prices' ],
		} );
	};

	const handlePricesError = () => {
		dispatch( NOTICES_STORE_KEY ).addSnackbarNotice( {
			className: 'is-snackbar-error',
			content: __( 'You must have a price.', 'checkout_engine' ),
		} );
		dispatch( DATA_STORE_KEY ).addModel( 'prices', {} );
	};

	const onInvalid = () => {
		dispatch( UI_STORE_KEY ).setInvalid( true );
	};

	const toggleArchive = async () => {
		setConfirm( {} );
		toggleArchiveModel( 'products', 0 );
	};

	return (
		<Template
			status={ status }
			pageModelName={ 'products' }
			onSubmit={ onSubmit }
			onInvalid={ onInvalid }
			backUrl={ 'admin.php?page=ce-products' }
			backText={ __( 'Back to All Product', 'checkout_engine' ) }
			title={
				product?.id
					? sprintf(
							__( 'Edit %s', 'checkout_engine' ),
							product?.name || __( 'Product', 'checkout_engine' )
					  )
					: sprintf(
							__( 'Add %s', 'checkout_engine' ),
							product?.name || __( 'Product', 'checkout_engine' )
					  )
			}
			button={
				loading ? (
					<ce-skeleton
						style={ {
							width: '120px',
							height: '35px',
							display: 'inline-block',
						} }
					></ce-skeleton>
				) : (
					<div
						css={ css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						` }
					>
						<ProductActionsDropdown
							setConfirm={ setConfirm }
							product={ product }
							isSaving={ isSaving }
							toggleArchive={ toggleArchive }
						/>
						<SaveButton>
							{ product?.id
								? __( 'Update Product', 'checkout_engine' )
								: __( 'Create Product', 'checkout_engine' ) }
						</SaveButton>
					</div>
				)
			}
			notices={ snackbarNotices }
			removeNotice={ removeSnackbarNotice }
			noticeUI={ noticeUI }
			sidebar={
				<Sidebar
					loading={ loading }
					product={ product }
					isSaving={ isSaving }
				/>
			}
		>
			<Fragment>
				<FlashError path="products" scrollIntoView />
				<Details />
				<Prices />
			</Fragment>
		</Template>
	);
} );
