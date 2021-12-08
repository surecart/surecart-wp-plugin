import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

export default ( { className, attributes, setAttributes } ) => {
	return (
		<Fragment>
			<ce-session-detail
				label={ __( 'Name', 'checkout_engine' ) }
				value={ 'customer.name' }
			></ce-session-detail>
			<ce-session-detail
				label={ __( 'Email', 'checkout_engine' ) }
				value={ 'customer.email' }
			></ce-session-detail>
		</Fragment>
	);
};
