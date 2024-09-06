/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScButton, ScForm, ScSwitch } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import Error from '../../components/Error';

export default ({ title, onRequestClose, paymentMethod }) => {
	const { invoice, editInvoice, busy, error, saveInvoice } = useInvoice();
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);

	const messages = {
		notifyCustomer: __('Notify customer the invoice.', 'surecart'),
		notifyCustomerUpdate: __(
			'Notify customer that the invoice has been updated.',
			'surecart'
		),
	};

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
				onScFormSubmit={async () => {
					const data = await saveInvoice({
						paymentMethod,
						notificationsEnabled,
					});
					if (!!data) {
						onRequestClose();
					}
				}}
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
