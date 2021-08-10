const { __ } = wp.i18n;
const { Button } = wp.components;
const { useSelect, dispatch, select } = wp.data;
const { apiFetch } = wp;
import useSnackbar from '../../hooks/useSnackbar';

export default ( { style, className, children } ) => {
	const saving = useSelect( ( select ) => {
		return select( 'checkout-engine/ui' ).saving();
	} );

	const { addSnackbarNotice } = useSnackbar();

	const save = async ( e ) => {
		e.preventDefault();
		dispatch( 'checkout-engine/ui' ).setSaving( true );
		try {
			await saveCoupon();
			addSnackbarNotice( {
				content: __( 'Coupon Saved', 'checkout_engine' ),
			} );
		} catch ( e ) {
			addSnackbarNotice( {
				className: 'is-snackbar-error',
				content:
					e?.message ||
					__( 'Something went wrong.', 'checkout_engine' ),
			} );
		} finally {
			dispatch( 'checkout-engine/ui' ).setSaving( false );
		}
	};

	const saveCoupon = async () => {
		const id = wp.url.getQueryArg( window.location, 'id' );

		const coupon = await apiFetch( {
			path: `checkout-engine/v1/coupons/${ id }`,
			method: 'PATCH',
			data: select( 'checkout-engine/coupon' ).getCoupon( id ),
		} );

		dispatch( 'checkout-engine/coupon' ).setCoupon( coupon );
	};

	return (
		<Button
			isPrimary
			style={ style }
			className={ className }
			disabled={ saving }
			isBusy={ saving }
			onClick={ save }
		>
			{ children }
		</Button>
	);
};
