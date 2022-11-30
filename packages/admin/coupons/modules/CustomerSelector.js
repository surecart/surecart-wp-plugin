/** @jsx jsx */
import {
	ScForm,
	ScIcon,
	ScInput,
	ScMenuDivider,
	ScButton,
	ScMenuItem,
} from '@surecart/components-react';
import { css, jsx } from '@emotion/core';
import { Modal } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import Error from '../../components/Error';
import ModelSelector from '../../components/ModelSelector';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default ({ id, onSelect }) => {
	const name = useRef();

	const [modal, setModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [newCustomer, setNewCustomer] = useState(null);

	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const updateCustomer = (data) =>
		setNewCustomer({
			...(newCustomer || {}),
			...data,
		});

	const onSubmit = async () => {
		try {
			setLoading(true);
			const customer = await saveEntityRecord(
				'surecart',
				'customer',
				newCustomer,
				{
					throwOnError: true,
				}
			);
			setNewCustomer(null);
			setModal(false);
			onSelect(customer?.id);
			createSuccessNotice(__('Customer created.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<ModelSelector
				name="customer"
				prefix={
					<div slot="prefix">
						<ScMenuItem
							onClick={() => {
								setModal(true);
								setTimeout(() => {
									name.current.triggerFocus();
								}, 50);
							}}
						>
							<ScIcon slot="prefix" name="plus" />
							{__('Add New', 'surecart')}
						</ScMenuItem>
						<ScMenuDivider />
					</div>
				}
				display={(item) =>
					`${!!item?.name ? `${item?.name} - ` : ''}${item.email}`
				}
				value={id}
				requestQuery={{
					archived: false,
				}}
				onSelect={(id) => {
					onSelect(id);
				}}
			/>

			{!!modal && (
				<Modal
					title={__('Add Customer', 'surecart')}
					css={css`
						max-width: 500px !important;
					`}
					onRequestClose={() => setModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<ScForm
						onScFormSubmit={onSubmit}
						css={css`
							--sc-form-row-spacing: var(--sc-spacing-large);
						`}
					>
						<Error error={error} setError={setError} />

						<ScInput
							ref={name}
							label={__('First Name', 'surecart')}
							type="text"
							onScInput={(e) =>
								updateCustomer({ first_name: e.target.value })
							}
							tabIndex="0"
							autofocus
						/>

						<ScInput
							label={__('Last Name', 'surecart')}
							onScInput={(e) =>
								updateCustomer({ last_name: e.target.value })
							}
							tabIndex="0"
							type="text"
						/>

						<ScInput
							label={__('Email', 'surecart')}
							type="email"
							onScInput={(e) =>
								updateCustomer({ email: e.target.value })
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
							<ScButton type="primary" busy={loading} submit>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								type="text"
								onClick={() => setModal(false)}
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					</ScForm>
				</Modal>
			)}
		</>
	);
};
