/**
 * External dependencies.
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { getQueryArgs } from '@wordpress/url';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { store as dataStore } from '@surecart/data';

export const useInvoice = () => {
	const urlParams = getQueryArgs(window.location.href);
	const defaultLiveMode = urlParams.live_mode === 'false' ? false : true;
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [busy, setBusy] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);

	// useSelect to get the existing invoice
	const {
		isResolving: loading,
		editedRecord: invoice,
		edit: editInvoice,
	} = useEntityRecord('surecart', 'invoice', id);

	const receiveInvoice = (updatedInvoice) => {
		return receiveEntityRecords(
			'surecart',
			'invoice',
			updatedInvoice,
			undefined,
			false,
			invoice
		);
	};

	return {
		loading,
		invoice,
		busy,
		setBusy,
		live_mode:
			invoice?.live_mode !== undefined
				? invoice.live_mode
				: defaultLiveMode,
		checkout: invoice?.checkout,
		editInvoice,
		receiveInvoice,
		isDraftInvoice: invoice?.status === 'draft',
	};
};
