/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as dataStore } from '@surecart/data';
import { store as noticesStore } from '@wordpress/notices';
import {
	ScButton,
	ScBlockUi,
	ScDialog,
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
import Tax from './modules/Tax';

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
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [liveMode, setLiveMode] = useState(false);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [busy, setBusy] = useState(false);
	const [checkoutError, setCheckoutError] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState(false);

	const { checkout, loading, error } = useSelect(
		(select) => {
			// we don't yet have a checkout.
			if (!id) {
				return {};
			}

			// our entity query data.
			const entityData = [
				'surecart',
				'draft-checkout',
				id,
				{ expand, refresh_price_versions: true },
			];

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
				error: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...entityData
				),
			};
		},
		[id]
	);

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
			setBusy(true);
			const { id } = await saveEntityRecord(
				'surecart',
				'draft-checkout',
				{
					customer_id: false,
					live_mode: liveMode,
				}
			);

			setCheckoutId(id);
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

	const setCheckoutId = (id) => {
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
			window.location.href = `admin.php?page=sc-orders&action=edit&id=${
				order?.id || order
			}`;
			createSuccessNotice(__('Order Created.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			setCheckoutError(e);
			setBusy(false);
		}
	};

	const isDisabled =
		checkout?.selected_shipping_choice_required &&
		!checkout?.selected_shipping_choice;

	if (checkout?.order) {
		return (
			<ScAlert
				type="danger"
				title={__('Order Complete', 'surecart')}
				open
				css={css`
					margin-top: 20px;
					margin-right: 20px;
				`}
			>
				{__(
					'This order has already been created. Please create a new order.',
					'surecart'
				)}
			</ScAlert>
		);
	}

	return (
		<>
			<UpdateModel
				onSubmit={() => setConfirmCheckout(true)}
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
						busy={busy}
						disabled={
							isDisabled ||
							busy ||
							!scData?.entitlements?.invoices
						}
					>
						{__('Create Order', 'surecart')}
					</ScButton>
				}
				sidebar={
					<>
						<SelectCustomer
							checkout={checkout}
							setBusy={setBusy}
							loading={loading}
							liveMode={liveMode}
							onSuccess={() => setPaymentMethod(null)}
						/>
						<Address
							checkout={checkout}
							loading={loading}
							busy={busy}
							setBusy={setBusy}
						/>
						<Tax
							checkout={checkout}
							loading={loading}
							busy={busy}
							setBusy={setBusy}
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
					loading={loading}
					setBusy={setBusy}
				/>

				<SelectShipping
					checkout={checkout}
					loading={loading}
					setBusy={setBusy}
				/>

				{!!checkout?.line_items?.data?.length && (
					<Payment
						checkout={checkout}
						loading={loading}
						setBusy={setBusy}
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
					/>
				)}

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
