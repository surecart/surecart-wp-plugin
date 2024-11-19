/**
 * External dependencies.
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
import { createErrorString } from '../../../util';
import Confirm from '../../../components/confirm';

export default ({ customerId, isDefault, paymentMethod }) => {
	const [modal, setModal] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const {
		saveEditedEntityRecord,
		editEntityRecord,
		deleteEntityRecord,
		invalidateResolutionForStore,
	} = useDispatch(coreStore);

	const { isDirty, isSaving } = useSelect((select) => {
		const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } =
			select(coreStore);
		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
		return {
			isDirty: dirtyEntityRecords.length > 0,
			isSaving: dirtyEntityRecords.some((record) =>
				isSavingEntityRecord(record.kind, record.name, record.key)
			),
		};
	}, []);

	/** Set the default payment method. */
	const setDefault = async (id) => {
		if (isDirty) {
			const r = confirm(
				__(
					'This will save any changes on the page. Do you want to save your changes?',
					'surecart'
				)
			);
			if (!r) return;
		}

		await editEntityRecord('surecart', 'customer', customerId, {
			default_payment_method: id,
		});

		try {
			await saveEditedEntityRecord('surecart', 'customer', customerId, {
				throwOnError: true,
			});
			// create success notice.
			createSuccessNotice(
				__('Default payment method changed.', 'surecart'),
				{ type: 'snackbar' }
			);
			// invalidate page.
			await invalidateResolutionForStore();
		} catch (e) {
			console.error(e);
			createErrorNotice(createErrorString(e), { type: 'snackbar' });
		}
	};

	const onDelete = async () => {
		try {
			setBusy(true);
			setError(null);
			await deleteEntityRecord(
				'surecart',
				'payment_method',
				paymentMethod?.id,
				{},
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(__('Payment method deleted.', 'surecart'), {
				type: 'snackbar',
			});
			await invalidateResolutionForStore();
			setModal(false);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScFlex alignItems="center" justifyContent="flex-end">
			{isDefault && <ScTag type="info">Default</ScTag>}
			{!isDefault && (
				<ScDropdown placement="bottom-end" disabled={isSaving}>
					<ScButton type="text" circle slot="trigger">
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem
							onClick={() => setDefault(paymentMethod?.id)}
						>
							{__('Make Default', 'surecart')}
						</ScMenuItem>
						<ScMenuItem onClick={() => setModal(true)}>
							{__('Delete', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			)}

			{!!modal && (
				<Confirm
					open={!!modal}
					onRequestClose={() => setModal(false)}
					onConfirm={onDelete}
					loading={busy}
					error={error}
				>
					{__('Are you sure? This cannot be undone.', 'surecart')}
				</Confirm>
			)}
		</ScFlex>
	);
};
