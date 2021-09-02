/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { dispatch } = wp.data;

import { STORE_KEY as STORE_UI_KEY } from '../store/ui';

import {
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/react';

// template
import Template from '../templates/SingleModel';

// components
import SaveButton from './components/SaveButton';
import ProductActionsDropdown from './components/ProductActionsDropdown';

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
		saveProduct,
		updateProduct,
		loading,
		isSaving,
	} = useProductData();

	const onSubmit = async ( e ) => {
		e.preventDefault();
		await saveProduct();
	};

	const onInvalid = () => {
		dispatch( STORE_UI_KEY ).setInvalid( true );
	};

	const toggleArchive = async () => {
		updateProduct( { archived: ! product?.archived } );
		await saveProduct();
		setConfirm( {} );
	};

	return (
		<Template
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
				<Details
					loading={ loading }
					product={ product }
					updateProduct={ updateProduct }
				/>
				<Prices />
			</Fragment>
		</Template>
	);
} );
