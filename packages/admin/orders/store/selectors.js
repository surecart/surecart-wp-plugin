import { createRegistrySelector } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';

/**
 * Select the session
 */
export const selectCheckoutSession = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectModel( 'checkout_sessions', 0 )
);

/**
 * Select the customer
 */
export const selectCustomer = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectModel( 'customers', 0 )
);

/**
 * Select the customer
 */
export const selectSubscriptions = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectCollection( 'subscriptions' )
);

/**
 * Select the customer
 */
export const selectCharges = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectCollection( 'charges' )
);

/**
 * Select the customer
 */
export const selectLineItems = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectCollection( 'line_items' )
);

/**
 * Has this been created?
 */
export const isCreated = createRegistrySelector( ( select ) => () =>
	select( coreStore ).isCreated()
);

/**
 * Is the model saving?
 */
export const selectError = createRegistrySelector( ( select ) => () => {
	return select( coreStore ).selectError();
} );
