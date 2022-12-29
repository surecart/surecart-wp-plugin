/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScForm,
	ScFormControl,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuDivider,
	ScMenuItem,
	ScSkeleton,
} from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import ModelSelector from '../../components/ModelSelector';
import useAvatar from '../../hooks/useAvatar';
import { Modal } from '@wordpress/components';
import Error from '../../components/Error';

export default ({ promotion, updatePromotion }) => {
	const name = useRef();
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(null);
	const [newCustomer, setNewCustomer] = useState(null);
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const updateNewCustomer = (data) =>
		setNewCustomer({
			...(newCustomer || {}),
			...data,
		});

	const { customer, loading } = useSelect(
		(select) => {
			if (!promotion?.customer?.id && !promotion?.customer) return {};
			const queryArgs = [
				'surecart',
				'customer',
				promotion?.customer?.id || promotion?.customer,
			];
			return {
				customer: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[promotion?.customer]
	);

	const onSubmit = async () => {
		try {
			setSaving(true);
			const customer = await saveEntityRecord(
				'surecart',
				'customer',
				newCustomer,
				{
					throwOnError: true,
				}
			);
			setModal(false);
			updatePromotion({ customer_id: customer?.id });
			createSuccessNotice(__('Customer created.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setSaving(false);
		}
	};

	const avatarUrl = useAvatar({ email: customer?.email });

	if (loading) {
		return (
			<ScCard>
				<ScSkeleton />
			</ScCard>
		);
	}

	return (
		<>
			<ScFormControl
				label={__('Limit To A Specific Customer', 'surecart')}
				style={{ display: 'block' }}
			>
				{customer?.id ? (
					<ScCard>
						<ScFlex
							alignItems="center"
							justifyContent="space-between"
						>
							<ScFlex
								alignItems="center"
								justifyContent="flex-start"
							>
								<div>
									<img
										src={avatarUrl}
										css={css`
											width: 36px;
											height: 36px;
											border-radius: var(
												--sc-border-radius-medium
											);
										`}
									/>
								</div>
								<div>
									<div>{customer?.name}</div>
									<div>{customer?.email}</div>
								</div>
							</ScFlex>

							<ScDropdown placement="bottom-end">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() =>
											updatePromotion({ customer: null })
										}
									>
										<ScIcon
											slot="prefix"
											name="trash"
											style={{
												opacity: 0.5,
											}}
										/>
										{__('Remove', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						</ScFlex>
					</ScCard>
				) : (
					<ModelSelector
						name="customer"
						placeholder={__('Any Customer', 'surecart')}
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
							`${!!item?.name ? `${item?.name} - ` : ''}${
								item.email
							}`
						}
						value={promotion?.customer?.id || promotion?.customer}
						onSelect={(customer) => updatePromotion({ customer })}
					/>
				)}
			</ScFormControl>

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
							type="text"
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
							<ScButton type="primary" busy={saving} submit>
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
