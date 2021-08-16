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
import { getCoupon } from '../products/store/selectors';

export default withNotices( ( { noticeOperations, noticeUI } ) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	const {
		loading,
		promotion,
		coupon,
		updateCoupon,
		updatePromotion,
	} = useSelect( ( select ) => {
		const { isResolving, getPromotion, getCoupon } = select(
			'checkout-engine/coupon'
		);
		const { updateCoupon, updatePromotion } = dispatch(
			'checkout-engine/coupon'
		);

		return {
			loading: isResolving( 'getPromotion' ),
			promotion: getPromotion(),
			coupon: getCoupon(),
			updateCoupon,
			updatePromotion,
		};
	} );

	return (
		<Template
			title={
				loading ? (
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
						{ __( 'Save Coupon', 'checkout_engine' ) }
					</SaveButton>
				)
			}
			notices={ snackbarNotices }
			removeNotice={ removeSnackbarNotice }
			noticeUI={ noticeUI }
			sidebar={ <Sidebar coupon={ coupon } loading={ loading } /> }
		>
			<Fragment>
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
				<Limits
					loading={ loading }
					coupon={ coupon }
					updateCoupon={ updateCoupon }
				/>
			</Fragment>
		</Template>
	);
} );
