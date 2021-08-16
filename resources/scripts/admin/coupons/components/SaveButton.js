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
			await savePromotion();
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

	/**
	 * Save the promotion.
	 * @returns promise
	 */
	const savePromotion = async () => {
		let promotion = select( 'checkout-engine/coupon' ).getPromotion();

		const response = await apiFetch( {
			path: promotion?.id
				? `checkout-engine/v1/promotions/${ promotion?.id }`
				: 'checkout-engine/v1/promotions',
			method: promotion?.id ? 'PATCH' : 'POST',
			data: promotion,
		} );

		return response;
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
