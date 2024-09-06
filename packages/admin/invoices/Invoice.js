/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

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
	ScIcon,
} from '@surecart/components-react';
import Prices from './modules/Prices';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import SelectCustomer from './modules/SelectCustomer';
import SelectShipping from './modules/SelectShipping';
import Address from './modules/Address';
import Payment from './modules/Payment';
import Tax from './modules/Tax';
import Summary from './modules/Summary';
import AdditionalOptions from './modules/AdditionalOptions';
import PaidInvoiceConfirmModal from './modules/PaidInvoiceConfirmModal';
import DraftInvoiceConfirmModal from './modules/DraftInvoiceConfirmModal';
import SendNotificationConfirmModal from './modules/SendNotificationConfirmModal';
import DeleteInvoiceConfirmModal from './modules/DeleteInvoiceConfirmModal';
import { useInvoice } from './hooks/useInvoice';

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
	const [paymentMethod, setPaymentMethod] = useState(false);
	const [modal, setModal] = useState(null);

	const { loading, invoice, checkout, live_mode, isDraftInvoice, busy } =
		useInvoice();

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
		live_mode: live_mode ? 'true' : 'false',
	});

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
				modal: 'mark_as_paid',
			});
		}

		return menuItems;
	};

	return (
		<>
			<UpdateModel
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
									{!live_mode && (
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
							<ScDropdown
								position="bottom-right"
								style={{ '--panel-width': '14em' }}
							>
								<>
									<ScButton slot="trigger" type="text" circle>
										<ScIcon name="more-horizontal" />
									</ScButton>
									<ScMenu>
										<ScMenuItem
											onClick={() =>
												setModal('delete_invoice')
											}
										>
											{__('Delete Invoice', 'surecart')}
										</ScMenuItem>
									</ScMenu>
								</>
							</ScDropdown>

							{isDraftInvoice && (
								<ScButton
									type={
										isDraftInvoice ? 'primary' : 'default'
									}
									// submit
									busy={busy}
									disabled={
										isDisabled ||
										busy ||
										!scData?.entitlements?.invoices
									}
									onClick={() => setModal('send_invoice')}
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
						<Summary />
						<SelectCustomer
							onSuccess={() => setPaymentMethod(null)}
						/>
						<Address />
						<Tax />
					</>
				}
			>
				<Prices />
				<SelectShipping />

				{!!checkout?.line_items?.data?.length && (
					<Payment
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
					/>
				)}

				<AdditionalOptions />

				{busy && <ScBlockUi style={{ zIndex: 9 }} />}
			</UpdateModel>

			{modal === 'change_status_to_draft' && (
				<DraftInvoiceConfirmModal
					open={modal === 'change_status_to_draft'}
					onRequestClose={() => setModal(null)}
				/>
			)}

			{modal === 'mark_as_paid' && (
				<PaidInvoiceConfirmModal
					open={true}
					onRequestClose={() => setModal(null)}
				/>
			)}

			{modal === 'send_invoice' && (
				<SendNotificationConfirmModal
					onRequestClose={() => setModal(null)}
					title={getSubmitButtonTitle()}
					paymentMethod={paymentMethod}
				/>
			)}

			{modal === 'delete_invoice' && (
				<DeleteInvoiceConfirmModal
					open={true}
					onRequestClose={() => setModal(null)}
				/>
			)}
		</>
	);
};
