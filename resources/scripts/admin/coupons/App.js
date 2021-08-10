const { __ } = wp.i18n;
const { useSelect, dispatch } = wp.data;
const { Fragment, useEffect } = wp.element;
const { Icon, withNotices, Button } = wp.components;
const { getQueryArg } = wp.url;

import Template from '../templates/SingleModel';
import SaveButton from './components/SaveButton';
import Codes from './modules/Codes';
import Types from './modules/Types';
import Limits from './modules/Limits';
import Sidebar from './Sidebar';
import useSnackbar from '../hooks/useSnackbar';

export default withNotices( ( { noticeOperations, noticeUI } ) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	const {
		coupon,
		loading,
		updateCoupon,
		updatePromotion,
		promotions,
	} = useSelect( ( select ) => {
		const id = getQueryArg( window.location, 'id' );

		const { isResolving, getCoupon, getPromotions } = select(
			'checkout-engine/coupon'
		);
		const { updateCoupon, updatePromotion } = dispatch(
			'checkout-engine/coupon'
		);

		return {
			coupon: getCoupon( id ),
			updateCoupon,
			promotions: getPromotions( {
				coupon_ids: [ id ],
			} ),
			updatePromotion,
			loading: {
				coupon: isResolving( 'getCoupon', [ id ] ),
				promotion: isResolving( 'getPromotions', [
					{ coupon_ids: [ id ] },
				] ),
			},
		};
	} );

	return (
		<Template
			title={
				loading?.coupon ? (
					<ce-skeleton
						style={ { width: '120px', display: 'inline-block' } }
					></ce-skeleton>
				) : (
					<div>
						<Icon icon="tag" style={ { opacity: '0.25' } } />{ ' ' }
						{ coupon?.name
							? sprintf(
									__( 'Edit %s', 'checkout_engine' ),
									coupon.name
							  )
							: __( 'Add Coupon', 'checkout_engine' ) }
					</div>
				)
			}
			button={
				loading?.coupon || loading?.promotion ? (
					<ce-skeleton
						style={ {
							width: '120px',
							height: '35px',
							display: 'inline-block',
						} }
					></ce-skeleton>
				) : (
					<SaveButton>
						{ __( 'Save Coupon', 'checkout_engine' ) }
					</SaveButton>
				)
			}
			notices={ snackbarNotices }
			removeNotice={ removeSnackbarNotice }
			noticeUI={ noticeUI }
			sidebar={
				<Sidebar
					coupon={ coupon }
					loading={ loading?.coupon || loading?.promotion }
				/>
			}
		>
			<Fragment>
				<Codes
					loading={ loading?.promotion }
					promotion={ promotions?.[ 0 ] }
					updatePromotion={ updatePromotion }
				/>
				<Types
					loading={ loading?.coupon }
					coupon={ coupon }
					updateCoupon={ updateCoupon }
				/>
				<Limits
					loading={ loading?.coupon }
					coupon={ coupon }
					updateCoupon={ updateCoupon }
				/>
			</Fragment>
		</Template>
	);
} );
