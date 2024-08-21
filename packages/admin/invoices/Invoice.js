/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { store as dataStore } from '@surecart/data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import { getQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScBlockUi,
	ScTag,
	ScDropdown,
	ScMenuItem,
	ScMenu,
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
import Tax from './modules/Tax';
import Details from './modules/Details';
import AdditionalOptions from './modules/AdditionalOptions';
import PaidInvoiceConfirmModal from './modules/PaidInvoiceConfirmModal';
import DraftInvoiceConfirmModal from './modules/DraftInvoiceConfirmModal';

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

/**
 * Checkout expandable fields.
 */
export const checkoutExpands = [
	...(expand || []).map((item) => {
		return item.includes('.') ? item : `checkout.${item}`;
	}),
	'checkout',
];

export default () => {
	const urlParams = getQueryArgs(window.location.href);
	const defaultLiveMode = urlParams.live_mode === 'false' ? false : true;

	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [liveMode, setLiveMode] = useState(defaultLiveMode);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [busy, setBusy] = useState(false);
	const [invoiceError, setInvoiceError] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState(false);
	const [modal, setModal] = useState(null);

	const {
		isResolving: loading,
		editedRecord: invoice,
		edit: updateInvoice,
	} = useEntityRecord('surecart', 'invoice', id, {
		enabled: true,
	});

	const checkout = invoice?.checkout;
	const isDraftInvoice = invoice?.status === 'draft';

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

	const invoiceListPageURL = addQueryArgs('admin.php', {
		page: 'sc-invoices',
		live_mode: liveMode ? 'true' : 'false',
	});

	const changeInvoiceStatus = async (status) => {
		try {
			setBusy(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'invoice'
			);

			const action = status === 'draft' ? 'make_draft' : 'open';

			const requestData = {
				expand: checkoutExpands,
				// Append payment method for open status only.
				...(status === 'open' &&
					paymentMethod?.id && {
						manual_payment: !!paymentMethod.manual,
						...(paymentMethod.manual
							? { manual_payment_method_id: paymentMethod.id }
							: { payment_method_id: paymentMethod.id }),
					}),
			};

			return await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${id}/${action}`, requestData),
			});
		} catch (e) {
			console.error(e);
			setInvoiceError(e);
		} finally {
			setBusy(false);
		}
	};

	const updateInvoiceEntityRecord = (updatedInvoice) => {
		receiveEntityRecords(
			'surecart',
			'invoice',
			updatedInvoice,
			undefined,
			false,
			invoice
		);
	};

	const onSaveInvoice = async () => {
		try {
			setBusy(true);
			setInvoiceError(false);

			// Save the invoice, Remember, don't call saveEditedEntityRecord() here
			// as receiveEntityRecords() makes updates disallowed, or find a better approach.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'invoice'
			);

			await apiFetch({
				method: 'PATCH',
				path: `${baseURL}/${id}`,
				data: invoice,
			});

			const invoiceData = await changeInvoiceStatus('open');
			updateInvoiceEntityRecord(invoiceData);

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
		if (checkout?.order?.id && isDraftInvoice) {
			return __('Edit Invoice', 'surecart');
		}

		if (checkout?.order?.id && !isDraftInvoice) {
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

		if (checkout?.order?.id) {
			return isDraftInvoice
				? __('Update Invoice', 'surecart')
				: __('Edit Invoice', 'surecart');
		}

		return __('Create Invoice', 'surecart');
	};

	const getMenuItems = () => {
		const menuItems = [];

		if (invoice?.status === 'open') {
			menuItems.push({
				title: __('Edit Invoice', 'surecart'),
				modal: 'change_status_to_draft',
			});
		}

		if (!['draft', 'paid'].includes(invoice?.status)) {
			menuItems.push({
				title: __('Mark As Paid', 'surecart'),
				modal: 'order_mark_as_paid',
			});
		}

		return menuItems;
	};

	return (
		<>
			<UpdateModel
				onSubmit={onSaveInvoice}
				entitled={!!scData?.entitlements?.invoices}
				title={
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 1em;
						`}
					>
						<ScButton circle size="small" href={invoiceListPageURL}>
							<sc-icon name="arrow-left"></sc-icon>
						</ScButton>
						<sc-breadcrumbs>
							<sc-breadcrumb>
								<Logo display="block" />
							</sc-breadcrumb>
							<sc-breadcrumb href={invoiceListPageURL}>
								{__('Invoices', 'surecart')}
							</sc-breadcrumb>
							<sc-breadcrumb>
								<sc-flex style={{ gap: '1em' }}>
									{getViewButtonTitle()}{' '}
									{!liveMode && (
										<ScTag type="warning" pill>
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
						<div>
							{isDraftInvoice && (
								<ScButton
									type={
										isDraftInvoice ? 'primary' : 'default'
									}
									submit
									busy={busy}
									disabled={
										isDisabled ||
										busy ||
										!scData?.entitlements?.invoices
									}
								>
									{getSubmitButtonTitle()}
								</ScButton>
							)}

							<ScDropdown
								position="bottom-right"
								style={{ '--panel-width': '14em' }}
							>
								{getMenuItems().length > 0 && (
									<>
										<ScButton
											type="primary"
											slot="trigger"
											caret
											loading={loading}
										>
											{__('Actions', 'surecart')}
										</ScButton>
										<ScMenu>
											{getMenuItems().map(
												(menuItem, key) => (
													<ScMenuItem
														onClick={() =>
															setModal(
																menuItem.modal
															)
														}
														key={key}
													>
														{menuItem.title}
													</ScMenuItem>
												)
											)}
										</ScMenu>
									</>
								)}
							</ScDropdown>
						</div>
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
						/>
						<SelectCustomer
							invoice={invoice}
							onUpdateInvoiceEntityRecord={
								updateInvoiceEntityRecord
							}
							checkout={checkout}
							setBusy={setBusy}
							loading={loading}
							liveMode={liveMode}
							onSuccess={() => setPaymentMethod(null)}
						/>
						<Address
							invoice={invoice}
							onUpdateInvoiceEntityRecord={
								updateInvoiceEntityRecord
							}
							checkout={checkout}
							loading={loading}
							busy={busy}
							setBusy={setBusy}
						/>
						<Tax
							invoice={invoice}
							onUpdateInvoiceEntityRecord={
								updateInvoiceEntityRecord
							}
							checkout={checkout}
							loading={loading}
							busy={busy}
							setBusy={setBusy}
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
					invoice={invoice}
					onUpdateInvoiceEntityRecord={updateInvoiceEntityRecord}
					checkout={checkout}
					loading={loading}
					setBusy={setBusy}
				/>

				<SelectShipping
					invoice={invoice}
					onUpdateInvoiceEntityRecord={updateInvoiceEntityRecord}
					checkout={checkout}
					loading={loading}
					setBusy={setBusy}
				/>

				{!!checkout?.line_items?.data?.length && (
					<Payment
						invoice={invoice}
						updateInvoice={updateInvoice}
						onUpdateInvoiceEntityRecord={updateInvoiceEntityRecord}
						checkout={checkout}
						loading={loading}
						setBusy={setBusy}
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
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

			{!!modal && (
				<>
					<DraftInvoiceConfirmModal
						open={modal === 'change_status_to_draft'}
						onRequestClose={() => setModal(null)}
						changeInvoiceStatus={changeInvoiceStatus}
						onUpdateInvoiceEntityRecord={updateInvoiceEntityRecord}
						invoice={invoice}
					/>
					<PaidInvoiceConfirmModal
						open={modal === 'order_mark_as_paid'}
						onRequestClose={() => setModal(null)}
						invoice={invoice}
						checkout={checkout}
						onUpdateInvoiceEntityRecord={updateInvoiceEntityRecord}
						hasLoading={loading}
					/>
				</>
			)}
		</>
	);
};
