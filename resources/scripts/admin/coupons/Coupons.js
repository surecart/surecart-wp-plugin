/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { Button, Modal } from '@wordpress/components';

import { STORE_KEY as NOTICES_STORE_KEY } from '../store/notices';
import { STORE_KEY as UI_STORE_KEY } from '../store/ui';
import { STORE_KEY as DATA_STORE_KEY } from '../store/data';

import Template from '../templates/SingleModel';
import SaveButton from './components/SaveButton';
import DisableModal from './components/DisableModal';

// modules
import Name from './modules/Name';
import Codes from './modules/Codes';
import Types from './modules/Types';
import Duration from './modules/Duration';
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

	const {
		promotion,
		coupon,
		loading,
		saveCoupon,
		updateModel,
		isSaving,
	} = useCouponData();

	const updatePromotion = ( data ) => {
		return updateModel( 'promotions', data, 0 );
	};

	const updateCoupon = ( data ) => {
		return updateModel( 'coupons', data, 0 );
	};

	// get model errors
	const errors = useSelect( ( select ) =>
		select( UI_STORE_KEY ).selectErrors( 'products', 0 )
	);

	const onSubmit = async ( e ) => {
		e.preventDefault();
		dispatch( DATA_STORE_KEY ).saveModel( 'coupons', {
			with: [ 'promotions' ],
		} );
	};

	const deleteCoupon = () => {
		setConfirmDestroy( true );
		console.log( 'delete' );
	};

	const disableCoupon = async () => {
		updatePromotion( { active: false } );
		await saveCoupon();
		setConfirmDisable( false );
	};

	return (
		<Template
			onSubmit={ onSubmit }
			backUrl={ 'admin.php?page=ce-coupons' }
			backText={ __( 'Back to All Coupons', 'checkout_engine' ) }
			title={
				loading ? (
					<ce-skeleton
						style={ { width: '120px', display: 'inline-block' } }
					></ce-skeleton>
				) : (
					<div>
						{ coupon?.id
							? sprintf(
									__( 'Edit %s', 'checkout_engine' ),
									coupon?.name ||
										__( 'Coupon', 'checkout_engine' )
							  )
							: sprintf(
									__( 'Add %s', 'checkout_engine' ),
									coupon?.name ||
										__( 'Coupon', 'checkout_engine' )
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
						{ coupon?.id
							? __( 'Update Coupon', 'checkout_engine' )
							: __( 'Create Coupon', 'checkout_engine' ) }
					</SaveButton>
				)
			}
			notices={ snackbarNotices }
			removeNotice={ removeSnackbarNotice }
			noticeUI={ noticeUI }
			sidebar={
				<Sidebar
					promotion={ promotion }
					coupon={ coupon }
					loading={ loading }
				/>
			}
			footer={
				! loading &&
				!! promotion?.id && (
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
							onClick={ () => setConfirmDisable( true ) }
						>
							{ __( 'Archive', 'checkout_engine' ) }
						</Button>
						<Button
							className="ce-disable"
							isDestructive
							onClick={ deleteCoupon }
						>
							{ __( 'Delete', 'checkout_engine' ) }
						</Button>
					</div>
				)
			}
		>
			<Fragment>
				<Name
					loading={ loading }
					coupon={ coupon }
					updateCoupon={ updateCoupon }
				/>
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
			</Fragment>
		</Template>
	);
} );
