import { createRegistrySelector } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';

/**
 * Select the session
 */
export const selectSubscription = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectModel( 'subscriptions', 0 )
);

/**
 * Select the session
 */
export const selectSubscriptionItems = createRegistrySelector(
	( select ) => () =>
		select( coreStore ).selectCollection( 'subscription_items' )
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
