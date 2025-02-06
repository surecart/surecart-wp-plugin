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
	ScTag,
	ScDropdown,
	ScMenuItem,
	ScMenu,
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
import Error from '../components/Error';
import AdditionalOptions from './modules/AdditionalOptions';
import PaidInvoiceConfirmModal from './modules/PaidInvoiceConfirmModal';
import DraftInvoiceConfirmModal from './modules/DraftInvoiceConfirmModal';
import SendNotificationConfirmModal from './modules/SendNotificationConfirmModal';
import DeleteInvoiceConfirmModal from './modules/DeleteInvoiceConfirmModal';
import { useInvoice } from './hooks/useInvoice';
import { Button } from '@wordpress/components';
import { external, moreHorizontal } from '@wordpress/icons';

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
	const [modal, setModal] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState();

	const {
		loading,
		invoice,
		error,
		setError,
		checkout,
		live_mode,
		isDraftInvoice,
		busy,
	} = useInvoice();

	// listen for changes in payment method.
	useEffect(() => {
		if (checkout?.manual_payment) {
			setPaymentMethod(checkout?.manual_payment_method);
		} else {
			setPaymentMethod(checkout?.payment_method);
		}
	}, [checkout?.manual_payment, checkout?.payment_method]);

	const invoiceListPageURL = addQueryArgs('admin.php', {
		page: 'sc-invoices',
		live_mode: live_mode ? 'true' : 'false',
	});

	const canSave =
		checkout?.selected_shipping_choice_required &&
		!checkout?.selected_shipping_choice;

	const getViewButtonTitle = () => {
		if (!checkout?.order?.id) {
			return __('Create Invoice', 'surecart');
		}

		if (isDraftInvoice) {
			return __('Edit Invoice', 'surecart');
		}

		return __('View Invoice', 'surecart');
	};

	const getSubmitButtonTitle = () => {
		if (
			invoice?.automatic_collection &&
			isDraftInvoice &&
			!!paymentMethod?.id
		) {
			return __('Charge Customer', 'surecart');
		}

		if (!checkout?.order?.id) {
			return __('Create Invoice', 'surecart');
		}

		return isDraftInvoice
			? __('Update Invoice', 'surecart')
			: __('Edit Invoice', 'surecart');
	};

	const menuItems = [
		...(invoice?.status === 'open'
			? [
					{
						title: __('Edit Invoice', 'surecart'),
						modal: 'change_status_to_draft',
					},
			  ]
			: []),
		...(!['draft', 'paid'].includes(invoice?.status)
			? [
					{
						title: __('Mark As Paid', 'surecart'),
						modal: 'mark_as_paid',
					},
			  ]
			: []),
	];

	const renderActionButton = () => {
		if (invoice?.status === 'paid' && checkout?.order?.id) {
			return (
				<ScButton
					type="default"
					busy={busy}
					href={addQueryArgs('admin.php', {
						page: 'sc-orders',
						action: 'edit',
						id: checkout?.order?.id,
					})}
				>
					{__('View Order', 'surecart')}
				</ScButton>
			);
		}

		return (
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 1em;
				`}
			>
				<ScDropdown
					placement="bottom-end"
					style={{ '--panel-width': '14em' }}
				>
					<>
						<Button
							slot="trigger"
							icon={moreHorizontal}
							label={__('More', 'surecart')}
							showTooltip={true}
							size="compact"
						/>

						<ScMenu>
							<ScMenuItem
								onClick={() => setModal('delete_invoice')}
							>
								{__('Delete Invoice', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</>
				</ScDropdown>

				{invoice?.status === 'open' &&
					!!invoice?.checkout_url &&
					!!checkout?.order?.id && (
						<Button
							icon={external}
							label={__('View Invoice Payment Page', 'surecart')}
							href={invoice?.checkout_url}
							showTooltip={true}
							size="compact"
							target="_blank"
						/>
					)}

				{isDraftInvoice && (
					<ScButton
						type={isDraftInvoice ? 'primary' : 'default'}
						busy={busy}
						disabled={
							canSave || busy || !scData?.entitlements?.invoices
						}
						submit
					>
						{getSubmitButtonTitle()}
					</ScButton>
				)}

				<ScDropdown
					position="bottom-right"
					style={{ '--panel-width': '14em' }}
				>
					{menuItems.length > 0 && (
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
								{menuItems.map((menuItem, key) => (
									<ScMenuItem
										onClick={() => setModal(menuItem.modal)}
										key={key}
									>
										{menuItem.title}
									</ScMenuItem>
								))}
							</ScMenu>
						</>
					)}
				</ScDropdown>
			</div>
		);
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
				button={renderActionButton()}
				sidebar={
					<>
						<Summary />
						<SelectCustomer />
						<Tax />
					</>
				}
				onSubmit={() => setModal('send_invoice')}
			>
				<Error error={error} setError={setError} />
				<Prices />
				<Address checkout={checkout} />
				<SelectShipping />

				{!!checkout?.line_items?.data?.length && (
					<Payment
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
					/>
				)}

				<AdditionalOptions />
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
				>
					{invoice?.automatic_collection &&
					isDraftInvoice &&
					!!paymentMethod?.id
						? __(
								'This will charge the customer immediately and create a new order.',
								'surecart'
						  )
						: __(
								'This will lock the invoice and prepare it for payment.',
								'surecart'
						  )}
				</SendNotificationConfirmModal>
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
