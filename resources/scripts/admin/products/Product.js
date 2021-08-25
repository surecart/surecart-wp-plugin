/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Button } = wp.components;

// template
import Template from '../templates/SingleModel';

// components
import SaveButton from './components/SaveButton';

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
		prices,
		addPrice,
		removePrice,
		updatePrice,
		loading,
		isSaving,
	} = useProductData();

	const onSubmit = async ( e ) => {
		e.preventDefault();
		await saveProduct();
	};

	// const deleteProduct = () => {
	// 	setConfirmDestroy( true );
	// 	console.log( 'delete' );
	// };

	const toggleArchive = async () => {
		updateProduct( { archived: ! product?.archived } );
		await saveProduct();

		setConfirm( {} );
	};

	return (
		<Template
			onSubmit={ onSubmit }
			backUrl={ 'admin.php?page=ce-products' }
			backText={ __( 'Back to All Product', 'checkout_engine' ) }
			title={
				loading ? (
					<ce-skeleton
						style={ { width: '120px', display: 'inline-block' } }
					></ce-skeleton>
				) : (
					<div>
						{ product?.id
							? sprintf(
									__( 'Edit %s', 'checkout_engine' ),
									product?.name ||
										__( 'Product', 'checkout_engine' )
							  )
							: sprintf(
									__( 'Add %s', 'checkout_engine' ),
									product?.name ||
										__( 'Product', 'checkout_engine' )
							  ) }
					</div>
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
					<SaveButton>
						{ product?.id
							? __( 'Update Product', 'checkout_engine' )
							: __( 'Create Product', 'checkout_engine' ) }
					</SaveButton>
				)
			}
			notices={ snackbarNotices }
			removeNotice={ removeSnackbarNotice }
			noticeUI={ noticeUI }
			sidebar={ <Sidebar loading={ loading } product={ product } /> }
			footer={
				! loading &&
				!! product?.id && (
					<div
						css={ css`
							display: flex;
							justify-content: space-between;
							align-items: center;
						` }
					>
						<Button
							className="ce-archive"
							isSecondary
							onClick={ () =>
								setConfirm( {
									title: product?.archived_at
										? sprintf(
												__(
													'Un-Archive %s?',
													'checkout_engine'
												),
												product?.name || 'Product'
										  )
										: sprintf(
												__(
													'Archive %s?',
													'checkout_engine'
												),
												product?.name || 'Product'
										  ),
									message: product?.archived_at
										? __(
												'This will make the product purchaseable again.',
												'checkout_engine'
										  )
										: __(
												'This product will not be purchaseable and all unsaved changes will be lost.',
												'checkout_engine'
										  ),
									confirmButtonText: product?.archived_at
										? sprintf(
												__(
													'Un-Archive %s?',
													'checkout_engine'
												),
												product?.name || 'Product'
										  )
										: sprintf(
												__(
													'Archive %s?',
													'checkout_engine'
												),
												product?.name || 'Product'
										  ),
									open: true,
									isSaving,
									className: 'ce-disable-confirm',
									isDestructive: true,
									onRequestClose: () => setConfirm( {} ),
									onRequestConfirm: toggleArchive,
								} )
							}
						>
							{ product?.archived_at
								? __( 'Un-Archive', 'checkout_engine' )
								: __( 'Archive', 'checkout_engine' ) }
						</Button>
						<Button
							className="ce-disable"
							isDestructive
							onClick={ () => {} }
						>
							{ __( 'Delete', 'checkout_engine' ) }
						</Button>
					</div>
				)
			}
		>
			<Fragment>
				<Details
					loading={ loading }
					product={ product }
					updateProduct={ updateProduct }
				/>
				<Prices
					loading={ loading }
					prices={ prices }
					addPrice={ addPrice }
					updatePrice={ updatePrice }
					removePrice={ removePrice }
				/>
				{ /*
				<Codes
					loading={ loading }
					promotion={ promotion }
					updatePromotion={ updatePromotion }
				/>
				<Types
					loading={ loading }
					coupon={ coupon }
					updateCoupon={ updateCoupon }
				/>
				<Duration
					loading={ loading }
					coupon={ coupon }
					updateCoupon={ updateCoupon }
				/>
				<Limits
					loading={ loading }
					promotion={ promotion }
					updatePromotion={ updatePromotion }
				/>

				{ confirmDestroy && (
					<Modal
						className={ 'ce-delete-confirm' }
						title={ sprintf(
							__( 'Delete "%s"?', 'checkout_engine' ),
							promotion?.code || 'Coupon'
						) }
						onRequestClose={ () => setConfirmDestroy( false ) }
					>
						<p>
							{ __(
								'Are you sure you want to delete this coupon? This can’t be undone.',
								'checkout_engine'
							) }
						</p>
						<Button
							isDestructive
							onClick={ () => setConfirmDestroy( false ) }
						>
							Delete
						</Button>
						<Button
							variant="secondary"
							onClick={ () => setConfirmDestroy( false ) }
						>
							Cancel
						</Button>
					</Modal>
				) }

				<DisableModal
					open={ confirmDisable }
					name={ promotion?.code }
					isSaving={ isSaving }
					onRequestClose={ () => setConfirmDisable( false ) }
					onRequestDisable={ () => {} }
				/> */ }
			</Fragment>
		</Template>
	);
} );
