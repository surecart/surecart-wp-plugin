const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Icon, withNotices } = wp.components;

import Template from '../templates/SingleModel';
import SaveButton from './components/SaveButton';
import Name from './modules/Name';
import Codes from './modules/Codes';
import Types from './modules/Types';
import Limits from './modules/Limits';
import Sidebar from './Sidebar';
import useSnackbar from '../hooks/useSnackbar';
import useCouponData from './hooks/useCouponData';

export default withNotices( ( { noticeOperations, noticeUI } ) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	const {
		promotion,
		coupon,
		loading,
		updateCoupon,
		updatePromotion,
	} = useCouponData();

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
						{ __( 'Save Coupon', 'checkout_engine' ) }
					</SaveButton>
				)
			}
			notices={ snackbarNotices }
			removeNotice={ removeSnackbarNotice }
			noticeUI={ noticeUI }
			sidebar={ <Sidebar promotion={ promotion } loading={ loading } /> }
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
				<Limits
					loading={ loading }
					coupon={ coupon }
					updateCoupon={ updateCoupon }
				/>
			</Fragment>
		</Template>
	);
} );
