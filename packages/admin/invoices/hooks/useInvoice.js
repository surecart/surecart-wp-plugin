/**
 * External dependencies.
 */
import { select, useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
import { store as noticesStore } from '@wordpress/notices';
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
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { baseURL } = select(coreStore).getEntityConfig(
		'surecart',
		'invoice'
	);

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

	const saveInvoice = async ({ paymentMethod, notificationsEnabled }) => {
		try {
			setBusy(true);
			setError(null);

			// Set the notification_enabled flag by default to true.
			invoice.notifications_enabled = notificationsEnabled;

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
					...(paymentMethod?.id && {
						manual_payment: !!paymentMethod.manual,
						...(paymentMethod.manual
							? { manual_payment_method_id: paymentMethod.id }
							: { payment_method_id: paymentMethod.id }),
					}),
				}),
			});

			receiveInvoice(invoiceData);

			createSuccessNotice(__('Invoice Saved.', 'surecart'), {
				type: 'snackbar',
			});

			return invoiceData;
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const draftInvoice = async () => {
		try {
			setBusy(true);
			setError(null);

			const invoiceData = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${invoice?.id}/make_draft`, {
					expand: checkoutExpands,
				}),
			});

			receiveInvoice(invoiceData);

			createSuccessNotice(
				__('Invoice marked as draft, you can now edit it.', 'surecart'),
				{
					type: 'snackbar',
				}
			);

			return invoiceData;
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const onRemovePrice = async (id) => {
		try {
			setBusy(true);

			// delete the entity record.
			await deleteEntityRecord('surecart', 'line_item', id, null, {
				throwOnError: true,
			});

			// get the checkouts endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			// fetch the updated checkout.
			const data = await apiFetch({
				path: addQueryArgs(`${baseURL}/${invoice?.checkout?.id}`, {
					expand: checkoutExpands,
				}),
			});

			receiveInvoice({
				...invoice,
				checkout: data,
			});

			return data;
		} catch (e) {
			console.error(e);
			setE(e);
		} finally {
			setBusy(false);
		}
	};

	const onChangePrice = async (id, data) => {
		try {
			setBusy(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			const { checkout } = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${id}`, {
					expand: checkoutExpands,
				}),
				data,
			});

			receiveInvoice({
				...invoice,
				checkout,
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

			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			// add the line item.
			const { checkout } = await apiFetch({
				method: 'POST',
				path: addQueryArgs(baseURL, {
					expand: checkoutExpands,
				}),
				data,
			});

			receiveInvoice({
				...invoice,
				checkout,
			});

			return checkout;
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

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			const { checkout } = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${id}`, {
					expand: checkoutExpands,
				}),
				data,
			});

			receiveInvoice({
				...invoice,
				checkout,
			});

			return checkout;
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const updateCheckout = async (requestData = {}) => {
		try {
			setBusy(true);
			setError(null);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${invoice?.checkout?.id}`, {
					expand,
				}),
				data: requestData,
			});

			receiveInvoice({
				...invoice,
				checkout: data,
			});

			return data;
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const markAsPaid = async () => {
		try {
			setBusy(true);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);

			const checkoutUpdated = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`${baseURL}/${invoice?.checkout?.id}/manually_pay`,
					{
						expand,
					}
				),
			});

			receiveInvoice({
				...invoice,
				status: checkoutUpdated?.status,
				checkout: checkoutUpdated,
			});

			createSuccessNotice(__('Invoice marked as Paid.', 'surecart'), {
				type: 'snackbar',
			});

			return checkoutUpdated;
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return {
		loading,
		invoice,
		busy,
		error,
		setError,
		live_mode:
			invoice?.live_mode !== undefined
				? invoice.live_mode
				: defaultLiveMode,
		checkout: invoice?.checkout,
		editInvoice,
		receiveInvoice,
		saveInvoice,
		draftInvoice,
		isDraftInvoice: invoice?.status === 'draft',
		checkoutExpands,
		onRemovePrice,
		onChangePrice,
		addLineItem,
		updateLineItem,
		updateCheckout,
		markAsPaid,
	};
};
