const { __ } = wp.i18n;
const { Button } = wp.components;
const { useSelect, dispatch } = wp.data;

export default ( { style, className, children } ) => {
	const saving = useSelect( ( select ) => {
		return select( 'checkout-engine/ui' ).saving();
	} );

	const save = ( e ) => {
		e.preventDefault();
		dispatch( 'checkout-engine/ui' ).setSaving( true );
		setTimeout( () => {
			dispatch( 'checkout-engine/notices' ).addNotice( {
				content: __( 'Coupon Saved', 'checkout_engine' ),
			} );
			dispatch( 'checkout-engine/ui' ).setSaving( false );
		}, 1000 );
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
