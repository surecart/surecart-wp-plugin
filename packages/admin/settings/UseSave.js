import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

// Module-level flag to keep all SaveButton instances in a busy/spinner state
// after save completes (e.g. while the page reloads). Set via keepBusy option
// in save(), read by SaveButton via isKeepBusy(). Resets on page reload.
let _keepBusy = false;
export const isKeepBusy = () => _keepBusy;

export default function useSave() {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEditedEntityRecord } = useDispatch(coreStore);

	/**
	 * Handle the form submission
	 */
	const save = async ({ successMessage, keepBusy }) => {
		if (keepBusy) {
			_keepBusy = true;
		}
		// build up pending records to save.
		const dirtyRecords =
			select(coreStore).__experimentalGetDirtyEntityRecords();
		const pendingSavedRecords = [];
		dirtyRecords.forEach(({ kind, name, key }) => {
			pendingSavedRecords.push(
				saveEditedEntityRecord(kind, name, key, {
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
