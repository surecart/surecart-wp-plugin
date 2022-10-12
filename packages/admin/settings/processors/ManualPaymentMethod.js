import {
	ScStackedListRow,
	ScIcon,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScMenuDivider,
	ScBlockUi,
	ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import CreateEditPaymentMethod from './CreateEditPaymentMethod';

export default ({ paymentMethod }) => {
	const { deleteEntityRecord, saveEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [busy, setBusy] = useState(false);
	const [open, setOpen] = useState(false);

	const onDelete = async () => {
		const r = confirm(
			__(
				'Are you sure you want to delete this payment method?',
				'surecart'
			)
		);
		if (!r) return;
		try {
			setBusy(true);
			await deleteEntityRecord(
				'surecart',
				'manual_payment_method',
				paymentMethod?.id,
				undefined,
				{ throwOnError: true }
			);
			createSuccessNotice(__('Payment method deleted.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
		} finally {
			setBusy(false);
		}
	};

	const toggleArchive = async () => {
		const r = confirm(
			paymentMethod?.archived
				? __(
						'Are you sure you want to enable this payment method?',
						'surecart'
				  )
				: __(
						'Are you sure you want to disable this payment method?',
						'surecart'
				  )
		);
		if (!r) return;
		try {
			setBusy(true);
			const result = await saveEntityRecord(
				'surecart',
				'manual_payment_method',
				{
					...paymentMethod,
					archived: !paymentMethod?.archived,
				},
				{ throwOnError: true }
			);
			createSuccessNotice(
				result?.archived
					? __('Payment method disabled.', 'surecart')
					: __('Payment method enabled.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<ScStackedListRow>
				<div>
					<strong>
						{paymentMethod?.name}{' '}
						{paymentMethod?.archived ? (
							<ScTag type="warning" size="small">
								{__('Disabled', 'surecart')}
							</ScTag>
						) : (
							<ScTag type="success" size="small">
								{__('Enabled', 'surecart')}
							</ScTag>
						)}
					</strong>
					<div>{paymentMethod?.description}</div>
				</div>
				<ScDropdown slot="suffix" placement="bottom-end">
					<ScButton circle slot="trigger" type="text">
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem onClick={() => setOpen(true)}>
							<ScIcon
								name="edit"
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
							/>
							{__('Edit', 'surecart')}
						</ScMenuItem>
						{paymentMethod?.archived ? (
							<ScMenuItem onClick={toggleArchive}>
								<ScIcon
									name="circle"
									slot="prefix"
									style={{
										opacity: 0.5,
									}}
								/>
								{__('Enable', 'surecart')}
							</ScMenuItem>
						) : (
							<ScMenuItem onClick={toggleArchive}>
								<ScIcon
									name="slash"
									slot="prefix"
									style={{
										opacity: 0.5,
									}}
								/>
								{__('Disable', 'surecart')}
							</ScMenuItem>
						)}
						<ScMenuDivider />
						<ScMenuItem onClick={onDelete}>
							<ScIcon
								name="trash"
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
							/>
							{__('Delete', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScStackedListRow>
			{busy && <ScBlockUi spinner />}

			<CreateEditPaymentMethod
				paymentMethod={paymentMethod}
				open={open}
				onRequestClose={() => setOpen(false)}
			/>
		</>
	);
};
