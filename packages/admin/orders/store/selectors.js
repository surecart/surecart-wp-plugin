import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { createRegistrySelector } from '@wordpress/data';

/**
 * Select the session
 */
export const selectOrder = createRegistrySelector(
	(select) => () => select(coreStore).selectModel('orders', 0)
);

/**
 * Select the customer
 */
export const selectCustomer = createRegistrySelector(
	(select) => () => select(coreStore).selectModel('customers', 0)
);

/**
 * Select the customer
 */
export const selectSubscriptions = createRegistrySelector(
	(select) => () => select(coreStore).selectCollection('subscriptions')
);

/**
 * Select the customer
 */
export const selectPurchases = createRegistrySelector(
	(select) => () => select(coreStore).selectCollection('purchases')
);

/**
 * Select the customer
 */
export const selectCharges = createRegistrySelector(
	(select) => () => select(coreStore).selectCollection('charges')
);

/**
 * Select the customer
 */
export const selectLineItems = createRegistrySelector(
	(select) => () => select(coreStore).selectCollection('line_items')
);

/**
 * Has this been created?
 */
export const isCreated = createRegistrySelector(
	(select) => () => select(coreStore).isCreated()
);

/**
 * Is the model saving?
 */
export const selectError = createRegistrySelector((select) => () => {
	return select(coreStore).selectError();
});
