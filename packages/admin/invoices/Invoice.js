/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as dataStore } from '@surecart/data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { getQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScBlockUi, ScTag } from '@surecart/components-react';
import Prices from './modules/Prices';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import expand from './checkout-query';
import SelectCustomer from './modules/SelectCustomer';
import SelectShipping from './modules/SelectShipping';
import Address from './modules/Address';
import Payment from './modules/Payment';
import Error from '../components/Error';
import Tax from './modules/Tax';
import Details from './modules/Details';
import ConfirmChangeInvoiceStatus from './components/ConfirmChangeInvoiceStatus';
import AdditionalOptions from './modules/AdditionalOptions';

/**
 * Returns the Model Edit URL.
 *
 * @param {number} postId Post ID.
 *
 * @return {string} Post edit URL.
 */
export function getEditURL(id) {
	return addQueryArgs(window.location.href, { id });
}

export default () => {
	const urlParams = getQueryArgs(window.location.href);
	const defaultLiveMode = urlParams.live_mode === 'false' ? false : true;

	const [historyId, setHistoryId] = useState(null);
	const {
		saveEntityRecord,
		receiveEntityRecords,
		editEntityRecord,
		saveEditedEntityRecord,
	} = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [liveMode, setLiveMode] = useState(defaultLiveMode);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [busy, setBusy] = useState(false);
	const [invoiceError, setInvoiceError] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState(false);
	const [modal, setModal] = useState(null);

	const { invoice, invoiceStatus, checkout, loading, error } = useSelect(
		(select) => {
			// we don't have an invoice id yet.
			if (!id) {
				return {};
			}

			const invoiceEntityData = ['surecart', 'invoice', id];
			const invoice = select(coreStore).getEditedEntityRecord(
				...invoiceEntityData
			);

			const checkoutId = invoice?.checkout;
			const checkoutEntityData = [
				'surecart',
				'checkout',
				checkoutId,
				{ expand },
			];
			const checkout = select(coreStore).getEditedEntityRecord(
				...checkoutEntityData
			);

			const loadingInvoice = !select(coreStore)?.hasFinishedResolution?.(
				'getEditedEntityRecord',
				[...invoiceEntityData]
			);

			const loadingCheckout = !select(coreStore)?.hasFinishedResolution?.(
				'getEditedEntityRecord',
				[...checkoutEntityData]
			);

			return {
				invoice,
				invoiceStatus: invoice?.status,
				checkout,
				loading: loadingInvoice || loadingCheckout, // && !invoice?.id
				error: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...invoiceEntityData
				),
			};
		},
		[id]
	);

	const invoiceId = invoice?.id;
	const isDraftInvoice = invoiceStatus === 'draft';
	const invoiceOrder = checkout?.order;

	// we don't yet have an invoice.
	useEffect(() => {
		if (!id) {
			createInvoice();
		}
	}, [id]);

	// Update live mode when invoice is loaded.
	useEffect(() => {
		if (invoice?.id) {
			setLiveMode(invoice?.live_mode);
		}
	}, [invoice]);

	// Update payment methods when checkout is loaded.
	useEffect(() => {
		if (checkout?.payment_method?.id && !checkout?.manual_payment) {
			setPaymentMethod(checkout?.payment_method);
		} else if (checkout?.manual_payment_method?.id) {
			setPaymentMethod(checkout?.manual_payment_method);
		}
	}, [checkout]);

	useEffect(() => {
		if (error) {
			setInvoiceError(error);
		}
	}, [error]);

	/**
	 * Creates a new invoice on page load.
	 */
	const createInvoice = async () => {
		try {
			setBusy(true);
			const { id } = await saveEntityRecord('surecart', 'invoice', {
				live_mode: liveMode,
			});

			setInvoiceId(id);
		} catch (e) {
			console.error(e);
			setInvoiceError(e);
		} finally {
			setBusy(false);
		}
	};

	/**
	 * Replaces the browser URL with a edit link for a given id ID.
	 *
	 * @param {number} id id for the model for which to generate edit URL.
	 */
	const setBrowserURL = (id) => {
		window.history.replaceState({ id }, 'Invoice ' + id, getEditURL(id));
		setHistoryId(id);
	};

	const setInvoiceId = (id) => {
		if (id && id !== historyId) {
			setBrowserURL(id);
		}
	};

	const updateInvoice = (data) => {
		return editEntityRecord('surecart', 'invoice', invoiceId, data);
	};

	const changeInvoiceStatus = async (status) => {
		try {
			setBusy(true);

			// For open status, we need to add minimum one line item and customer.
			// if (status === 'open') {
			// 	if (!checkout?.line_items?.data?.length) {
			// 		setInvoiceError(
			// 			__('Please add at least one line item.', 'surecart')
			// 		);
			// 		return;
			// 	}

			// 	if (!checkout?.customer_id) {
			// 		setInvoiceError(
			// 			__('Please select a customer.', 'surecart')
			// 		);
			// 		return;
			// 	}
			// }

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'invoice'
			);

			const action = status === 'draft' ? 'make_draft' : 'open';
			let requestData = {};
			if (status === 'open' && !!paymentMethod?.id) {
				requestData = {
					...(paymentMethod?.manual
						? {
								manual_payment: true,
								manual_payment_method_id: paymentMethod?.id,
						  }
						: {
								manual_payment: false,
								payment_method_id: paymentMethod?.id,
						  }),
				};
			}

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`${baseURL}/${invoice?.id}/${action}`,
					requestData
				),
			});

			// Update the invoice in the redux store.
			receiveEntityRecords(
				'surecart',
				'invoice',
				data,
				undefined,
				false,
				invoice
			);

			const message =
				status === 'draft'
					? __(
							'Invoice marked as draft, you can now edit it.',
							'surecart'
					  )
					: __('Invoice Updated.', 'surecart');

			createSuccessNotice(message, {
				type: 'snackbar',
			});

			return data;
		} catch (e) {
			console.error(e);
			setInvoiceError(e);
		} finally {
			setBusy(false);
		}
	};

	const saveInvoice = async () => {
		if (!isDraftInvoice) {
			return;
		}

		try {
			setBusy(true);
			setInvoiceError(false);
			await saveEditedEntityRecord('surecart', 'invoice', invoice?.id);

			if (isDraftInvoice) {
				return await changeInvoiceStatus('open');
			}

			// Update the checkout in the redux store as invoice number is added to checkout.order
			receiveEntityRecords(
				'surecart',
				'checkout',
				checkout,
				undefined,
				false,
				checkout
			);

			createSuccessNotice(__('Invoice Saved.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setInvoiceError(e);
		} finally {
			setBusy(false);
		}
	};

	const isDisabled =
		checkout?.selected_shipping_choice_required &&
		!checkout?.selected_shipping_choice;

	const getViewButtonTitle = () => {
		if (invoiceOrder?.id && isDraftInvoice) {
			return __('Edit Invoice', 'surecart');
		}

		if (invoiceOrder?.id && !isDraftInvoice) {
			return __('View Invoice', 'surecart');
		}

		return __('Create Invoice', 'surecart');
	};

	const getSubmitButtonTitle = () => {
		if (
			invoice?.automatic_collection &&
			isDraftInvoice &&
			!!paymentMethod?.id
		) {
			return __('Charge Customer', 'surecart');
		}

		if (invoiceOrder?.id && isDraftInvoice) {
			return __('Update Invoice', 'surecart');
		}

		if (invoiceOrder?.id && !isDraftInvoice) {
			return __('Edit Invoice', 'surecart');
		}

		return __('Create Invoice', 'surecart');
	};

	return (
		<>
			<UpdateModel
				onSubmit={saveInvoice}
				entitled={!!scData?.entitlements?.invoices}
				title={
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 1em;
						`}
					>
						<ScButton
							circle
							size="small"
							href="admin.php?page=sc-invoices"
						>
							<sc-icon name="arrow-left"></sc-icon>
						</ScButton>
						<sc-breadcrumbs>
							<sc-breadcrumb>
								<Logo display="block" />
							</sc-breadcrumb>
							<sc-breadcrumb href="admin.php?page=sc-invoices">
								{__('Invoices', 'surecart')}
							</sc-breadcrumb>
							<sc-breadcrumb>
								<sc-flex style={{ gap: '1em' }}>
									{getViewButtonTitle()}{' '}
									{!liveMode && (
										<ScTag type="warning">
											{__('Test Mode', 'surecart')}
										</ScTag>
									)}
								</sc-flex>
							</sc-breadcrumb>
						</sc-breadcrumbs>
					</div>
				}
				button={
					invoice?.status !== 'paid' && (
						<ScButton
							type={isDraftInvoice ? 'primary' : 'default'}
							submit
							busy={busy}
							disabled={
								isDisabled ||
								busy ||
								!scData?.entitlements?.invoices
							}
							onClick={() => {
								if (isDraftInvoice) {
									return;
								}

								setModal('change_status_to_draft');
							}}
						>
							{getSubmitButtonTitle()}
						</ScButton>
					)
				}
				sidebar={
					<>
						<Details
							invoice={invoice}
							updateInvoice={updateInvoice}
							checkout={checkout}
							loading={loading}
							busy={busy}
							setBusy={setBusy}
							status={invoiceStatus}
						/>
						<SelectCustomer
							checkout={checkout}
							setBusy={setBusy}
							loading={loading}
							liveMode={liveMode}
							onSuccess={() => setPaymentMethod(null)}
							isDraftInvoice={isDraftInvoice}
						/>
						<Address
							checkout={checkout}
							loading={loading}
							busy={busy}
							setBusy={setBusy}
							isDraftInvoice={isDraftInvoice}
						/>
						<Tax
							checkout={checkout}
							loading={loading}
							busy={busy}
							setBusy={setBusy}
							isDraftInvoice={isDraftInvoice}
						/>
					</>
				}
			>
				<Error
					error={invoiceError}
					setError={setInvoiceError}
					margin="80px"
				/>

				<Prices
					checkout={checkout}
					invoice={invoice}
					loading={loading}
					setBusy={setBusy}
				/>

				<SelectShipping
					checkout={checkout}
					loading={loading}
					setBusy={setBusy}
					isDraftInvoice={isDraftInvoice}
				/>

				{!!checkout?.line_items?.data?.length && (
					<Payment
						invoice={invoice}
						updateInvoice={updateInvoice}
						checkout={checkout}
						loading={loading}
						setBusy={setBusy}
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
						isDraftInvoice={isDraftInvoice}
					/>
				)}

				<AdditionalOptions
					invoice={invoice}
					updateInvoice={updateInvoice}
					loading={loading}
					busy={busy}
					setBusy={setBusy}
				/>

				{busy && <ScBlockUi style={{ zIndex: 9 }} />}
			</UpdateModel>

			{modal && (
				<ConfirmChangeInvoiceStatus
					open={modal === 'change_status_to_draft'}
					onRequestClose={() => setModal(null)}
					changeInvoiceStatus={changeInvoiceStatus}
					invoice={invoice}
				/>
			)}
		</>
	);
};
