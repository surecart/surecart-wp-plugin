import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

import { componentProductIdOf } from './utils';

// Resolve a bundle item's component product from the inline expand or the
// core-data store. The picker queries the store, so picked products are
// already cached there.
export default (item) => {
	const inline =
		typeof item?.component_product === 'object' && item?.component_product !== null
			? item.component_product
			: null;

	const id = componentProductIdOf(item);

	const fromStore = useSelect(
		(select) =>
			id ? select(coreStore).getEntityRecord('surecart', 'product', id) : null,
		[id]
	);

	return inline || fromStore || null;
};
