/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { Fragment, useState, useEffect } = wp.element;
const { useSelect } = wp.data;
const { Button, Modal } = wp.components;

import Template from '../templates/SingleModel';
import SaveButton from './components/SaveButton';
import DisableModal from './components/DisableModal';
import Name from './modules/Name';
import Codes from './modules/Codes';
import Types from './modules/Types';
import Duration from './modules/Duration';
import Limits from './modules/Limits';
import Sidebar from './Sidebar';
import useSnackbar from '../hooks/useSnackbar';
import useCouponData from './hooks/useCouponData';

export default ( { noticeOperations, noticeUI } ) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();
	const [ confirmDestroy, setConfirmDestroy ] = useState( false );
	const [ confirmDisable, setConfirmDisable ] = useState( false );

	const {
		promotion,
		coupon,
		loading,
		updateCoupon,
		updatePromotion,
		saveCoupon,
		isSaving,
	} = useCouponData();

	const onSubmit = ( e ) => {
		e.preventDefault();
		saveCoupon();
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
							className="ce-disable"
							isSecondary
							onClick={ () => setConfirmDisable( true ) }
						>
							{ __( 'Disable', 'checkout_engine' ) }
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
				/>
			</Fragment>
		</Template>
	);
};
