/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useSelect, dispatch } from '@wordpress/data';
import { Button, Modal } from '@wordpress/components';
import { CeAlert } from '@checkout-engine/react';

import { store as uiStore } from '../store/ui';
import { store as dataStore } from '../store/data';

import Template from '../templates/SingleModel';
import FlashError from '../components/FlashError';
import SaveButton from './components/SaveButton';
import DisableModal from './components/DisableModal';

// modules
import Name from './modules/Name';
import Codes from './modules/Codes';
import Types from './modules/Types';
import Limits from './modules/Limits';

// parts
import Sidebar from './Sidebar';

// hooks
import useSnackbar from '../hooks/useSnackbar';
import useCouponData from './hooks/useCouponData';

// hocs
import withConfirm from '../hocs/withConfirm';

export default withConfirm( ( { setConfirm, noticeUI } ) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	const { coupon, error, loading, status, save } = useCouponData();

	const onSubmit = async ( e ) => {
		e.preventDefault();
		save();
	};

	const onInvalid = () => {
		dispatch( uiStore ).setInvalid( true );
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

	const title = () => {
		if ( loading ) {
			return (
				<ce-skeleton
					style={ {
						width: '120px',
						display: 'inline-block',
					} }
				></ce-skeleton>
			);
		}

		return coupon?.id
			? sprintf(
					__( 'Edit %s', 'checkout_engine' ),
					coupon?.name || __( 'Coupon', 'checkout_engine' )
			  )
			: sprintf(
					__( 'Add %s', 'checkout_engine' ),
					coupon?.name || __( 'Coupon', 'checkout_engine' )
			  );
	};

	return (
		<Template
			pageModelName={ 'coupons' }
			onSubmit={ onSubmit }
			onInvalid={ onInvalid }
			backUrl={ 'admin.php?page=ce-coupons' }
			backText={ __( 'Back to All Coupons', 'checkout_engine' ) }
			title={ title() }
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
						{ /* <ProductActionsDropdown
							setConfirm={ setConfirm }
							product={ product }
							isSaving={ isSaving }
							toggleArchive={ toggleArchive }
						/> */ }
						<SaveButton>
							{ coupon?.id
								? __( 'Update Coupon', 'checkout_engine' )
								: __( 'Create Coupon', 'checkout_engine' ) }
						</SaveButton>
					</div>
				)
			}
			notices={ snackbarNotices }
			removeNotice={ removeSnackbarNotice }
			noticeUI={ noticeUI }
			sidebar={ <Sidebar /> }
		>
			<Fragment>
				<FlashError path="coupons" scrollIntoView />
				<Name />
				<Codes />
				<Types />
				<Limits />
			</Fragment>
		</Template>
	);

	// return (
	// 	<Template
	// 		onSubmit={ onSubmit }
	// 		backUrl={ 'admin.php?page=ce-coupons' }
	// 		backText={ __( 'Back to All Coupons', 'checkout_engine' ) }
	// 		title={
	// 			loading ? (
	// 				<ce-skeleton
	// 					style={ { width: '120px', display: 'inline-block' } }
	// 				></ce-skeleton>
	// 			) : (
	// 				<div>
	// 					{ coupon?.id
	// 						? sprintf(
	// 								__( 'Edit %s', 'checkout_engine' ),
	// 								coupon?.name ||
	// 									__( 'Coupon', 'checkout_engine' )
	// 						  )
	// 						: sprintf(
	// 								__( 'Add %s', 'checkout_engine' ),
	// 								coupon?.name ||
	// 									__( 'Coupon', 'checkout_engine' )
	// 						  ) }
	// 				</div>
	// 			)
	// 		}
	// 		button={
	// 			loading ? (
	// 				<ce-skeleton
	// 					style={ {
	// 						width: '120px',
	// 						height: '35px',
	// 						display: 'inline-block',
	// 					} }
	// 				></ce-skeleton>
	// 			) : (
	// 				<SaveButton>
	// 					{ coupon?.id
	// 						? __( 'Update Coupon', 'checkout_engine' )
	// 						: __( 'Create Coupon', 'checkout_engine' ) }
	// 				</SaveButton>
	// 			)
	// 		}
	// 		notices={ snackbarNotices }
	// 		removeNotice={ removeSnackbarNotice }
	// 		noticeUI={ noticeUI }
	// 		sidebar={
	// 			<Sidebar
	// 				promotion={ promotion }
	// 				coupon={ coupon }
	// 				loading={ loading }
	// 			/>
	// 		}
	// 		footer={
	// 			! loading &&
	// 			!! promotion?.id && (
	// 				<div
	// 					css={ css`
	// 						display: flex;
	// 						justify-content: space-between;
	// 						align-items: center;
	// 					` }
	// 				>
	// 					<Button
	// 						className="ce-archive"
	// 						isSecondary
	// 						onClick={ () => setConfirmDisable( true ) }
	// 					>
	// 						{ __( 'Archive', 'checkout_engine' ) }
	// 					</Button>
	// 					<Button
	// 						className="ce-disable"
	// 						isDestructive
	// 						onClick={ deleteCoupon }
	// 					>
	// 						{ __( 'Delete', 'checkout_engine' ) }
	// 					</Button>
	// 				</div>
	// 			)
	// 		}
	// 	>
	// 		<Fragment>
	// 			<Name
	// 				loading={ loading }
	// 				coupon={ coupon }
	// 				updateCoupon={ updateCoupon }
	// 			/>
	// 		</Fragment>
	// 	</Template>
	// );
} );
