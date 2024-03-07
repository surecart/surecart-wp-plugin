/**
 * External dependencies.
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default () => {
	return useSelect((select) => {
		return select(coreStore)?.getEditedEntityRecord?.(
			'surecart',
			'store',
			'account'
		);
	}, []);
};
