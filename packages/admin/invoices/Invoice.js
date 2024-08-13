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
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScBlockUi,
	ScDialog,
	ScAlert,
} from '@surecart/components-react';
import Prices from './modules/Prices';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import expand from './checkout-query';
import SelectCustomer from './modules/SelectCustomer';
import SelectShipping from './modules/SelectShipping';
import Address from './modules/Address';
import Payment from './modules/Payment';
import Error from '../components/Error';
import { formatNumber } from '../util';
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
	const [historyId, setHistoryId] = useState(null);
	const [confirmCheckout, setConfirmCheckout] = useState(false);
	const {
		saveEntityRecord,
		receiveEntityRecords,
		editEntityRecord,
		saveEditedEntityRecord,
	} = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [liveMode, setLiveMode] = useState(true);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [busy, setBusy] = useState(false);
	const [checkoutError, setCheckoutError] = useState(false);
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

			const loading = !select(coreStore)?.hasFinishedResolution?.(
				'getEditedEntityRecord',
				[...invoiceEntityData]
			);

			return {
				invoice,
				invoiceStatus: invoice?.status,
				checkout,
				loading: !checkout?.id && loading,
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

	useEffect(() => {
		if (error) {
			setCheckoutError(error);
		}
	}, [error]);

	// create the checkout for the first time.
	const createInvoice = async () => {
		try {
			setBusy(true);
			const { id } = await saveEntityRecord('surecart', 'invoice', {
				live_mode: liveMode,
			});

			setInvoiceId(id);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong.', 'surecart')
			);
			(e?.additional_errors || []).map((e) => {
				if (e?.message) {
					createErrorNotice(e.message, {
						type: 'snackbar',
					});
				}
			});
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
		window.history.replaceState({ id }, 'Checkout ' + id, getEditURL(id));
		setHistoryId(id);
	};

	const setInvoiceId = (id) => {
		if (id && id !== historyId) {
			setBrowserURL(id);
		}
	};

	const finalizeCheckout = async ({ id }) => {
		return await apiFetch({
			method: 'PATCH',
			path: addQueryArgs(`surecart/v1/draft-checkouts/${id}/finalize`, {
				manual_payment: paymentMethod?.id ? false : true,
				payment_method_id: paymentMethod?.id || null,
			}),
		});
	};

	/**
	 * Save the checkout.
	 */
	const saveCheckout = async () => {
		try {
			setCheckoutError(false);
			setBusy(true);
			const { order } = await finalizeCheckout({
				id: checkout?.id,
			});
			window.location.href = `admin.php?page=sc-invoices&action=edit&id=${
				order?.id || order
			}`;
			createSuccessNotice(__('Invoice Created.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			setCheckoutError(e);
			setBusy(false);
		}
	};

	const updateInvoice = (data) => {
		return editEntityRecord('surecart', 'invoice', invoiceId, data);
	};

	const changeInvoiceStatus = async (status) => {
		try {
			setBusy(true);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'invoice'
			);

			const action = status === 'draft' ? 'make_draft' : 'open';
			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${invoice?.id}/${action}`, {}),
				data: {},
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'invoice',
				data,
				undefined,
				false,
				invoice
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
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
			await saveEditedEntityRecord('surecart', 'invoice', invoice?.id);

			if (isDraftInvoice) {
				await changeInvoiceStatus('open');
			}

			createSuccessNotice(__('Invoice Saved.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(e);
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
									{getViewButtonTitle()}
								</sc-flex>
							</sc-breadcrumb>
						</sc-breadcrumbs>
					</div>
				}
				button={
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

							if (
								invoiceStatus !== 'draft' &&
								invoiceStatus !== 'paid'
							) {
								setModal('change_status_to_draft');
							}
						}}
					>
						{getSubmitButtonTitle()}
					</ScButton>
				}
				sidebar={
					<>
						<Details
							invoice={invoice}
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
					error={checkoutError}
					setError={setCheckoutError}
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

			<ScDialog
				open={confirmCheckout}
				onScRequestClose={() => setConfirmCheckout(false)}
				label={
					paymentMethod?.id && checkout?.amount_due
						? __('Confirm Charge', 'surecart')
						: __('Confirm Manual Payment', 'surecart')
				}
			>
				{paymentMethod?.id && checkout?.amount_due ? (
					<ScAlert
						type="warning"
						title={sprintf(
							__('This will charge the customer %s.', 'surecart'),
							formatNumber(
								checkout?.amount_due || 0,
								checkout?.currency || 'usd'
							)
						)}
						open
					>
						{__('Are you sure you want to continue?', 'surecart')}
					</ScAlert>
				) : (
					<ScAlert
						type="warning"
						title={__('Confirm Manual Payment', 'surecart')}
						open
					>
						{sprintf(
							__(
								'This will create an invoice that requires a manual payment (i.e. cash or check). Once you create this invoice it is not possible to pay it another way. Do you want to continue?',
								'surecart'
							)
						)}
					</ScAlert>
				)}

				{isDraftInvoice && (
					<ScButton
						slot="footer"
						type="primary"
						onClick={async () => {
							// setConfirmCheckout(false);
							await saveInvoice(isDraftInvoice ? 'open' : null);
							// await saveCheckout();
						}}
					>
						{getSubmitButtonTitle()}
					</ScButton>
				)}

				<ScButton
					slot="footer"
					type="text"
					onClick={() => setConfirmCheckout(false)}
				>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDialog>

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
