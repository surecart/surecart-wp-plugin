/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { useRef, useState, useEffect } from '@wordpress/element';
import { Modal } from '@wordpress/components';

export default ({ onRequestClose, onCreate, liveMode }) => {
	const name = useRef();
	const [busy, setBusy] = useState(false);
	const [customer, setCustomer] = useState({
		live_mode: liveMode,
	});
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);

	// Focus the name input when this is loaded.
	useEffect(() => {
		setTimeout(() => {
			name.current.triggerFocus();
		}, 50);
	}, []);

	// Update the customer.
	const updateNewCustomer = (data) =>
		setCustomer({
			...(customer || {}),
			...data,
		});

	// Handle form submission.
	const onSubmit = async () => {
		try {
			setBusy(true);
			const created = await saveEntityRecord(
				'surecart',
				'customer',
				customer,
				{
					throwOnError: true,
				}
			);
			onCreate(created?.id);
			onRequestClose();
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
			(e?.additional_errors || []).map((e) => {
				if (e?.message) {
					createErrorNotice(e.message, {
						type: 'snackbar',
					});
				}
			});
			setBusy(false);
		}
	};

	return (
		<Modal
			title={__('Add Customer', 'surecart')}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={false}
		>
			<ScForm
				onScFormSubmit={onSubmit}
				css={css`
					--sc-form-row-spacing: var(--sc-spacing-large);
				`}
			>
				<ScInput
					ref={name}
					label={__('First Name', 'surecart')}
					onScInput={(e) =>
						updateNewCustomer({
							first_name: e.target.value,
						})
					}
					tabIndex="0"
					autofocus
				/>

				<ScInput
					label={__('Last Name', 'surecart')}
					onScInput={(e) =>
						updateNewCustomer({ last_name: e.target.value })
					}
					tabIndex="0"
				/>

				<ScInput
					label={__('Email', 'surecart')}
					type="email"
					onScInput={(e) =>
						updateNewCustomer({ email: e.target.value })
					}
					tabIndex="0"
					required
				/>

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ScButton type="primary" busy={busy} submit>
						{__('Create', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={() => setModal(false)}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
			{busy && <ScBlockUi spinner />}
		</Modal>
	);
};
