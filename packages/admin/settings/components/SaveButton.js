const { __ } = wp.i18n;
const { Button } = wp.components;
const { useSelect, dispatch } = wp.data;

export default ( { style, className } ) => {
	const ui = useSelect( ( select ) => {
		return select( 'checkout-engine/settings' ).ui();
	} );

	const save = ( e ) => {
		e.preventDefault();
		dispatch( 'checkout-engine/settings' ).save();
	};

	return (
		<Button
			isPrimary
			style={ style }
			className={ className }
			disabled={ ui.saving }
			onClick={ save }
		>
			{ __( 'Save Changes', 'presto-player' ) }
		</Button>
	);
};
