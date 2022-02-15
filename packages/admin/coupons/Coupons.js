/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { CeAlert } from '@checkout-engine/components-react';

import { store as uiStore } from '../store/ui';
import { store as dataStore } from '../store/data';

import Template from '../templates/SingleModel';
import FlashError from '../components/FlashError';
import SaveButton from './components/SaveButton';

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
import { useEffect } from 'react';
import ErrorFlash from '../components/ErrorFlash';
import useCurrentPage from '../mixins/useCurrentPage';
import useEntities from '../mixins/useEntities';
import { useDispatch } from '@wordpress/data';
import DraftsProvider from '../components/drafts-provider';

export default withConfirm(({ noticeUI }) => {
	const { saveModel, updateModel, saveDraft, updateDraft, clearDrafts } =
		useDispatch(dataStore);
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);
	const {
		id,
		coupon,
		updateCoupon,
		saveCoupon,
		setSaving,
		isSaving,
		fetchCoupon,
		couponErrors,
		clearCouponErrors,
		isLoading,
	} = useCurrentPage('coupon');
	const { promotions, draftPromotions } = useEntities('promotion');

	// fetch product on load.
	useEffect(() => {
		if (id) {
			fetchCoupon({
				query: {
					context: 'edit',
					expand: ['promotions'],
				},
			});
		}
	}, []);

	const title = () => {
		if (isLoading) {
			return (
				<ce-skeleton
					style={{
						width: '120px',
						display: 'inline-block',
					}}
				></ce-skeleton>
			);
		}
		return coupon?.id
			? __('Edit Coupon', 'checkout_engine')
			: __('New Coupon', 'checkout_engine');
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const coupon = await saveCoupon(); // first save the product, in case we don't have an id.
			await Promise.all(
				(promotions || []).map((promotion) =>
					savePromotion(promotion, coupon)
				)
			);
			await Promise.all(
				(draftPromotions || []).map((promotion, index) =>
					saveDraftPromotion(promotion, index, coupon)
				)
			);
			await clearDrafts('promotion');
			addSnackbarNotice({
				content: __('Saved.'),
			});
		} catch (e) {
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	// save price
	const savePromotion = async (promotion, coupon) => {
		if (!promotion?.coupon) {
			await updateModel('promotion', promotion.id, {
				coupon: id || coupon?.id, // make sure coupon is set
			});
		}
		try {
			return await saveModel('promotion', promotion?.id);
		} catch (e) {
			addModelErrors('promotion', e);
		}
	};

	/** Save any draft prices. */
	const saveDraftPromotion = async (_, index, coupon) => {
		await updateDraft('promotion', index, {
			coupon: id || coupon?.id, // make sure coupon is set
		});
		try {
			return await saveDraft('promotion', index);
		} catch (e) {
			addModelErrors('promotion', e);
		}
	};

	return (
		<Template
			onSubmit={onSubmit}
			pageModelName={'coupon'}
			backUrl={'admin.php?page=ce-coupons'}
			backText={__('Back to All Coupons', 'checkout_engine')}
			title={title()}
			button={
				isLoading ? (
					<ce-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></ce-skeleton>
				) : (
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						{/* <ProductActionsDropdown
							setConfirm={ setConfirm }
							product={ product }
							isSaving={ isSaving }
							toggleArchive={ toggleArchive }
						/> */}
						<SaveButton>
							{coupon?.id
								? __('Update Coupon', 'checkout_engine')
								: __('Create Coupon', 'checkout_engine')}
						</SaveButton>
					</div>
				)
			}
			sidebar={<Sidebar />}
		>
			<Fragment>
				<ErrorFlash errors={couponErrors} onHide={clearCouponErrors} />

				<Name
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Codes id={coupon?.id || id} loading={isLoading} />

				<Types
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Limits
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>
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
});
