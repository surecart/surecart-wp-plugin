/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { Modal } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import { ScButton, ScForm, ScSwitch } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import Error from '../../components/Error';

export default ({ title, onRequestClose, paymentMethod, children }) => {
	const { invoice, editInvoice, invoiceOpenRequest } = useInvoice();
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(
		invoice?.notifications_enabled
	);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		setNotificationsEnabled(invoice?.notifications_enabled);
	}, [invoice?.notifications_enabled]);

	const messages = {
		notifyCustomer: __('Send an email to the customer.', 'surecart'),
		notifyCustomerUpdate: __('Send an email to the customer.', 'surecart'),
	};

	const saveInvoice = async () => {
		try {
			setBusy(true);
			setError(null);

			await invoiceOpenRequest({
				notifications_enabled: notificationsEnabled,
				payment_method: paymentMethod,
			});

			createSuccessNotice(__('Invoice saved.', 'surecart'), {
				type: 'snackbar',
			});

			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<Modal
			title={title}
			css={css`
				max-width: 600px !important;
			`}
			onRequestClose={onRequestClose}
		>
			<Error
				error={error}
				setError={setError}
				css={css`
					margin-bottom: var(--sc-spacing-medium);
				`}
			/>

			{children}

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
								notifications_enabled: e.target.checked,
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
