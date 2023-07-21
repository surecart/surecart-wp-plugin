/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as dataStore } from '@surecart/data';
import { store as noticesStore } from '@wordpress/notices';
import {
	ScButton,
	ScBlockUi,
	ScDialog,
	ScIcon,
	ScDashboardModule,
	ScAlert,
} from '@surecart/components-react';
import Prices from './modules/Prices';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import expand from './query';
import SelectCustomer from './modules/SelectCustomer';
import SelectShipping from './modules/SelectShipping';
import Address from './modules/Address';
import Payment from './modules/Payment';
import Error from '../components/Error';
import { formatNumber } from '../util';

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
	const [isSaving, setIsSaving] = useState(false);
	const [historyId, setHistoryId] = useState(null);
	const [confirmCheckout, setConfirmCheckout] = useState(false);
	const { saveEntityRecord, receiveEntityRecords } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [checkoutIdLoading, setCheckoutIdLoading] = useState(false);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [busyCustomer, setBusyCustomer] = useState(false);
	const [checkoutError, setCheckoutError] = useState(false);
	const [modal, setModal] = useState(false);
	const [paymentID, setPaymentID] = useState(false);

	const { checkout, loading, busy, error } = useSelect(
		(select) => {
			// we don't yet have a checkout.
			if (!id) {
				return {};
			}
			// our entity query data.
			const entityData = ['surecart', 'draft-checkout', id, { expand }];

			const checkout = select(coreStore).getEditedEntityRecord(
				...entityData
			);
			const loading = !select(coreStore)?.hasFinishedResolution?.(
				'getEditedEntityRecord',
				[...entityData]
			);

			return {
				checkout,
				loading: !checkout?.id && loading,
				busy: checkout?.id && loading,
				error: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...entityData
				),
			};
		},
		[id, line_items, checkout?.customer, checkout?.customer_id]
	);

	const customer = checkout?.customer;
	const line_items = checkout?.line_items;

	// we don't yet have a checkout.
	useEffect(() => {
		if (!id) {
			createCheckout();
		}
	}, [id]);

	useEffect(() => {
		if (error) {
			setCheckoutError(error);
		}
	}, [error]);

	// create the checkout for the first time.
	const createCheckout = async () => {
		try {
			setCheckoutIdLoading(true);

			const { id } = await saveEntityRecord(
				'surecart',
				'draft-checkout',
				{
					customer_id: false,
					live_mode: false, // TODO: Change to live.
				}
			);

			setCheckoutId(id);
		} catch (e) {
			console.error(e);

			createErrorNotice(
				e?.message || __('Something went wrong.', 'surecart')
			);
		} finally {
			setCheckoutIdLoading(false);
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

	const setCheckoutId = (id) => {
		if (id && id !== historyId) {
			setBrowserURL(id);
		}
	};

	const finalizeCheckout = async ({ id }) => {
		return await apiFetch({
			method: 'PATCH',
			path: addQueryArgs(`surecart/v1/draft-checkouts/${id}/finalize`, {
				manual_payment: paymentID ? false : true,
				payment_method_id: paymentID,
			}),
		});
	};

	/**
	 * Save the checkout.
	 */
	const saveCheckout = async () => {
		try {
			setCheckoutError(false);
			setIsSaving(true);
			const { order } = await finalizeCheckout({
				id: checkout?.id,
				customer_id: customer?.id,
			});
			window.location.href = `admin.php?page=sc-orders&action=edit&id=${
				order?.id || order
			}`;
			createSuccessNotice(__('Order Created.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			setCheckoutError(e);
			setIsSaving(false);
		}
	};

	const onAddressChange = async (address) => {
		try {
			setBusyCustomer(true);
			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${id}`, {
					expand,
				}),
				data: {
					customer_id: checkout?.customer_id,
					shipping_address: {
						...address,
					}, // update the address.
				},
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				data,
				undefined,
				false,
				checkout
			);

			createSuccessNotice(__('Shipping Address updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusyCustomer(false);
		}
	};

	const isDisabled =
		checkout?.selected_shipping_choice_required &&
		!checkout?.selected_shipping_choice;

	return (
		<>
			<Error error={checkoutError} setError={setCheckoutError} />
			<UpdateModel
				onSubmit={() => setConfirmCheckout(true)}
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
							href="admin.php?page=sc-orders"
						>
							<sc-icon name="arrow-left"></sc-icon>
						</ScButton>
						<sc-breadcrumbs>
							<sc-breadcrumb>
								<Logo display="block" />
							</sc-breadcrumb>
							<sc-breadcrumb href="admin.php?page=sc-orders">
								{__('Orders', 'surecart')}
							</sc-breadcrumb>
							<sc-breadcrumb>
								<sc-flex style={{ gap: '1em' }}>
									{__('Create Order', 'surecart')}
								</sc-flex>
							</sc-breadcrumb>
						</sc-breadcrumbs>
					</div>
				}
				button={
					<ScButton
						type="primary"
						submit
						loading={isSaving}
						disabled={isDisabled}
					>
						{__('Create Order', 'surecart')}
					</ScButton>
				}
				sidebar={
					<>
						<SelectCustomer
							checkout={checkout}
							busy={busy}
							loading={loading}
						/>
						<Address
							label={__('Shipping & Tax Address', 'surecart')}
							address={checkout?.shipping_address}
							onAddressChange={onAddressChange}
							loading={loading}
							busy={busy}
							busyCustomer={busyCustomer}
						/>
						<SelectShipping
							checkout={checkout}
							busy={busy}
							loading={loading}
						/>
					</>
				}
			>
				<Prices checkout={checkout} loading={loading} busy={busy} />

				{!!checkout?.line_items?.data?.length && (
					<Payment
						checkout={checkout}
						loading={loading}
						busy={busy}
						setPaymentID={setPaymentID}
						paymentID={paymentID}
					/>
				)}

				{!!checkoutIdLoading && <ScBlockUi spinner />}
			</UpdateModel>

			<ScDialog
				open={confirmCheckout}
				onScRequestClose={() => setConfirmCheckout(false)}
				label={__('Confirm Charge', 'surecart')}
			>
				{paymentID && checkout?.amount_due ? (
					<ScAlert
						type="warning"
						title={__('Confirm Charge', 'surecart')}
						open
					>
						{sprintf(
							__(
								'This will charge the customer %s. Are you sure you want to continue?',
								'surecart'
							),
							formatNumber(
								checkout?.amount_due || 0,
								checkout?.currency || 'usd'
							)
						)}
					</ScAlert>
				) : (
					<ScAlert
						type="warning"
						title={__('Confirm Manual Payment', 'surecart')}
						open
					>
						{sprintf(
							__(
								'This will create an order that requires a manual payment (i.e. cash or check). Once you create this order it is not possible to pay it another way. Do you want to continue?',
								'surecart'
							)
						)}
					</ScAlert>
				)}
				<ScButton
					slot="footer"
					type="primary"
					onClick={() => {
						setConfirmCheckout(false);
						saveCheckout();
					}}
				>
					{__('Create Order', 'surecart')}
				</ScButton>
				<ScButton
					slot="footer"
					type="text"
					onClick={() => setConfirmCheckout(false)}
				>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDialog>
		</>
	);
};
