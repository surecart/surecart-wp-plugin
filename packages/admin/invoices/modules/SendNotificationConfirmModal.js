/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import { ScButton, ScForm, ScSwitch } from '@surecart/components-react';
import { checkoutExpands } from '../Invoice';
import { useInvoice } from '../hooks/useInvoice';

export default ({ title, onRequestClose, paymentMethod }) => {
	const { invoice, editInvoice, receiveInvoice, saveInvoice } = useInvoice();
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);

	const messages = {
		notifyCustomer: __('Notify customer the invoice.', 'surecart'),
		notifyCustomerUpdate: __(
			'Notify customer that the invoice has been updated.',
			'surecart'
		),
	};

	// const onSaveInvoice = async () => {
	// 	try {
	// 		setBusy(true);
	// 		setError(false);

	// 		// Set the notification_enabled flag by default to true.
	// 		invoice.notifications_enabled = notificationsEnabled;

	// 		// Save the invoice, Remember, don't call saveEditedEntityRecord() here
	// 		// as receiveEntityRecords() makes updates disallowed, or find a better approach.
	// 		const { baseURL } = select(coreStore).getEntityConfig(
	// 			'surecart',
	// 			'invoice'
	// 		);

	// 		await apiFetch({
	// 			method: 'PATCH',
	// 			path: `${baseURL}/${invoice?.id}?refresh_status=1`,
	// 			data: invoice,
	// 		});

	// 		// Change the invoice status to open.
	// 		const invoiceData = await apiFetch({
	// 			method: 'PATCH',
	// 			path: addQueryArgs(`${baseURL}/${invoice?.id}/open`, {
	// 				expand: checkoutExpands,
	// 				...(paymentMethod?.id && {
	// 					manual_payment: !!paymentMethod.manual,
	// 					...(paymentMethod.manual
	// 						? { manual_payment_method_id: paymentMethod.id }
	// 						: { payment_method_id: paymentMethod.id }),
	// 				}),
	// 			}),
	// 		});

	// 		receiveInvoice(invoiceData);

	// 		createSuccessNotice(__('Invoice Saved.', 'surecart'), {
	// 			type: 'snackbar',
	// 		});
	// 		onRequestClose();
	// 	} catch (e) {
	// 		console.error(e);
	// 		setError(e);
	// 	} finally {
	// 		setBusy(false);
	// 	}
	// };

	return (
		<Modal
			title={title}
			css={css`
				max-width: 600px !important;
			`}
			onRequestClose={onRequestClose}
		>
			<Error error={error} />

			<ScForm
				onScFormSubmit={saveInvoice}
				css={css`
					--sc-form-row-spacing: var(--sc-spacing-large);
				`}
			>
				<div
					css={css`
						padding: var(--sc-spacing-large) 0;
					`}
				>
					<ScSwitch
						checked={notificationsEnabled}
						onScChange={(e) => {
							setNotificationsEnabled(e.target.checked);
							editInvoice({
								notification_enabled: e.target.checked,
							});
						}}
					>
						{invoice?.checkout?.order?.id
							? messages.notifyCustomerUpdate
							: messages.notifyCustomer}
					</ScSwitch>
				</div>

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ScButton type="primary" busy={busy} submit>
						{title}
					</ScButton>
					<ScButton type="text" onClick={() => onRequestClose()}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
		</Modal>
	);
};
