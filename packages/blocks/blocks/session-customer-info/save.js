import { __ } from '@wordpress/i18n';

export default () => {
	return (
		<div>
			<ce-session-detail
				label={ __( 'Name', 'checkout_engine' ) }
				value={ 'customer.name' }
			></ce-session-detail>
			<ce-session-detail
				label={ __( 'Email', 'checkout_engine' ) }
				value={ 'customer.email' }
			></ce-session-detail>
		</div>
	);
};
