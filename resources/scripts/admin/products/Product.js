/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

import { STORE_KEY as NOTICES_STORE_KEY } from '../store/notices';
import { STORE_KEY as UI_STORE_KEY } from '../store/ui';
import { STORE_KEY as DATA_STORE_KEY } from '../store/data';

// template
import Template from '../templates/SingleModel';

// components
import SaveButton from './components/SaveButton';
import ProductActionsDropdown from './components/ProductActionsDropdown';
import FlashError from '../components/FlashError';
import { CeAlert } from '@checkout-engine/react';

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
import useValidationErrors from '../hooks/useValidationErrors';

export default withConfirm( ( { setConfirm, noticeUI } ) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	const {
		product,
		error,
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

	if ( error?.message ) {
		return (
			<CeAlert
				css={ css`
					margin-top: 20px;
					margin-right: 20px;
				` }
				type="danger"
				open={ error?.message }
				onCeShow={ ( e ) => {
					if ( scrollIntoView ) {
						e.target.scrollIntoView( {
							behavior: 'smooth',
							block: 'start',
							inline: 'nearest',
						} );
					}
				} }
			>
				<span slot="title">
					{ __(
						'There was a critical error loading this page. Please reload the page and try again.',
						'checkout_engine'
					) }
				</span>
				{ error?.message }
			</CeAlert>
		);
	}

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
