import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function useSave() {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);

	/**
	 * Handle the form submission
	 */
	const save = async ({ successMessage }) => {
		// build up pending records to save.
		const dirtyRecords =
			select(coreStore).__experimentalGetDirtyEntityRecords();
		const pendingSavedRecords = [];
		dirtyRecords.forEach(({ kind, name, key }) => {
			const record = select(coreStore).getEditedEntityRecord(
				kind,
				name,
				key
			);
			pendingSavedRecords.push(
				saveEntityRecord(kind, name, record, {
					throwOnError: true,
				})
			);
		});

		// check values.
		const values = await Promise.all(pendingSavedRecords);
		if (values.some((value) => typeof value === 'undefined')) {
			throw { message: 'Saving failed.' };
		}

		createSuccessNotice(successMessage, {
			type: 'snackbar',
		});
	};

	return {
		save,
	};
}
