/**
 * External dependencies.
 */
import { select, useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { store as dataStore } from '@surecart/data';
import { store as uiStore } from '../../store/ui';
import expand from '../checkout-query';

export const useInvoice = () => {
	const urlParams = getQueryArgs(window.location.href);
	const defaultLiveMode = urlParams.live_mode === 'false' ? false : true;
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { setSaving: setBusy, setError } = useDispatch(uiStore);
	const busy = useSelect((select) => select(uiStore).isSaving());
	const error = useSelect((select) => select(uiStore).getError());
	const { receiveEntityRecords, deleteEntityRecord } = useDispatch(coreStore);

	/**
	 * Checkout expandable fields.
	 */
	const checkoutExpands = [
		...(expand || []).map((item) => {
			return item.includes('.') ? item : `checkout.${item}`;
		}),
		'checkout',
	];

	// useSelect to get the existing invoice
	const {
		isResolving: loading,
		editedRecord: invoice,
		edit: editInvoice,
	} = useEntityRecord('surecart', 'invoice', id);

	/**
	 * Receive the updated invoice.
	 *
	 * @param {Object} updatedInvoice - The updated invoice.
	 * @returns {void}
	 */
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

	/**
	 * Remove the line item by price ID.
	 *
	 * @param {string} id - The ID of the line item.
	 * @returns {Promise<Object>} The updated checkout.
	 */
	const removeLineItem = async (id) => {
		try {
			setBusy(true);

			// delete the entity record.
			await deleteEntityRecord('surecart', 'line_item', id, null, {
				throwOnError: true,
			});

			return await checkoutRequest({
				method: 'GET',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const updateLineItem = async (id, data) => {
		try {
			setBusy(true);

			const checkout = await lineItemRequest({
				id,
				method: 'PATCH',
				data,
			});

			return checkout;
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const addLineItem = async (data) => {
		try {
			setBusy(true);

			const checkout = await lineItemRequest({
				method: 'POST',
				data,
			});

			return checkout;
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const updateCheckout = async (data = {}) => {
		try {
			setBusy(true);
			setError(null);

			const checkout = await checkoutRequest({
				method: 'PATCH',
				data,
			});

			return checkout;
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const checkoutRequest = async ({ method, data = {} }) => {
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'draft-checkout'
		);

		const checkout = await apiFetch({
			method,
			path: addQueryArgs(`${baseURL}/${invoice?.checkout?.id}`, {
				expand,
				context: 'edit',
			}),
			...(Object.keys(data).length > 0 ? { data } : {}),
		});

		receiveInvoice({
			...invoice,
			checkout,
		});
	};

	const lineItemRequest = async ({ id, method, data = {} }) => {
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'line_item'
		);

		const { checkout } = await apiFetch({
			method,
			path: addQueryArgs(id ? `${baseURL}/${id}` : baseURL, {
				expand: checkoutExpands,
				context: 'edit',
			}),
			data,
		});

		receiveInvoice({
			...invoice,
			checkout,
		});

		return checkout;
	};

	/**
	 * Make the invoice a draft.
	 *
	 * @returns {Promise<void>}
	 */
	const makeDraftRequest = async () => {
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'invoice'
		);

		const invoiceData = await apiFetch({
			method: 'PATCH',
			path: addQueryArgs(`${baseURL}/${invoice?.id}/make_draft`, {
				expand: checkoutExpands,
			}),
		});

		receiveInvoice(invoiceData);
	};

	const markAsPaidRequest = async () => {
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'checkout'
		);

		const checkoutUpdated = await apiFetch({
			method: 'PATCH',
			path: addQueryArgs(
				`${baseURL}/${invoice?.checkout?.id}/manually_pay`,
				{
					expand: checkoutExpands,
				}
			),
		});

		receiveInvoice({
			...invoice,
			status: checkoutUpdated?.status,
			checkout: checkoutUpdated,
		});
	};

	/**
	 * Open the invoice.
	 *
	 * @param {Object} data - The data to update the invoice.
	 * @returns {Promise<void>}
	 */
	const invoiceOpenRequest = async (data = {}) => {
		const { notifications_enabled, payment_method, ...rest } = data;

		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'invoice'
		);

		// Save the invoice, Remember, don't call saveEditedEntityRecord() here
		// as receiveEntityRecords() makes updates disallowed, or find a better approach.
		await apiFetch({
			method: 'PATCH',
			path: `${baseURL}/${invoice?.id}?refresh_status=1`,
			data: invoice,
		});

		// Change the invoice status to open.
		const invoiceData = await apiFetch({
			method: 'PATCH',
			path: addQueryArgs(`${baseURL}/${invoice?.id}/open`, {
				expand: checkoutExpands,
				...(payment_method?.id && {
					manual_payment: !!payment_method.manual,
					...(payment_method.manual
						? { manual_payment_method_id: payment_method.id }
						: { payment_method_id: payment_method.id }),
				}),
			}),
			data: {
				notifications_enabled,
				...rest,
			},
		});

		receiveInvoice(invoiceData);
	};

	return {
		loading,
		invoice,
		busy,
		setBusy,
		error,
		setError,
		live_mode:
			invoice?.live_mode !== undefined
				? invoice.live_mode
				: defaultLiveMode,
		checkout: invoice?.checkout,
		editInvoice,
		receiveInvoice,
		isDraftInvoice: invoice?.status === 'draft',
		makeDraftRequest,
		invoiceOpenRequest,
		markAsPaidRequest,
		checkoutExpands,
		checkoutRequest,
		updateCheckout,
		addLineItem,
		removeLineItem,
		updateLineItem,
	};
};
