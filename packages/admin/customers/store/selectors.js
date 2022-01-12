import { store as coreStore } from '../../store/data';
import { store } from './index';
import { createRegistrySelector } from '@wordpress/data';

/**
 * Get the customer
 */
export const selectCustomer = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectModel( 'customers', 0 )
);

/**
 * Has this been created?
 */
export const isCreated = createRegistrySelector( ( select ) => () =>
	select( coreStore ).isCreated()
);

/**
 * Get the model status
 */
export const selectCustomerStatus = createRegistrySelector(
	( select ) => () => {
		const model = select( store ).selectCustomer();
		if ( ! model?.id ) {
			return 'draft';
		}
		return 'active';
	}
);

export const selectError = ( state ) => {
	return state.error;
};

/**
 * Is the model saving?
 */
export const isSaving = createRegistrySelector( ( select ) => () => {
	return select( 'checkout-engine/ui' ).isSaving();
} );
