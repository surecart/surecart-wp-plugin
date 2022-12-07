import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useState } from 'react';
import ConfirmDelete from './ConfirmDelete';

export default ({ customerId, isDefault, paymentMethod }) => {
	const [modal, setModal] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const {
		saveEditedEntityRecord,
		editEntityRecord,
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
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
		}
	};

	return (
		<ScFlex alignItems="center" justifyContent="flex-end">
			{isDefault && <ScTag type="info">Default</ScTag>}
			<ScDropdown placement="bottom-end" disabled={isSaving}>
				<ScButton type="text" circle slot="trigger">
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					{!isDefault && (
						<ScMenuItem
							onClick={() => setDefault(paymentMethod?.id)}
						>
							{__('Make Default', 'surecart')}
						</ScMenuItem>
					)}
					<ScMenuItem onClick={() => setModal(true)}>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
			{!!modal && (
				<ConfirmDelete
					paymentMethod={paymentMethod}
					onRequestClose={() => setModal(false)}
				/>
			)}
		</ScFlex>
	);
};
