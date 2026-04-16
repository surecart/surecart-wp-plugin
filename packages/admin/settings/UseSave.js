import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function useSave() {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEditedEntityRecord, editEntityRecord } =
		useDispatch(coreStore);

	const discard = () => {
		const dirtyRecords =
			select(coreStore).__experimentalGetDirtyEntityRecords();

		dirtyRecords.forEach(({ kind, name, key: recordId }) => {
			const edits = select(coreStore).getEntityRecordEdits(
				kind,
				name,
				recordId
			);
			if (!edits || !Object.keys(edits).length) {
				return;
			}
			const raw = select(coreStore).getRawEntityRecord(
				kind,
				name,
				recordId
			);
			const resetEdits = {};
			Object.keys(edits).forEach((editKey) => {
				resetEdits[editKey] = raw?.[editKey];
			});
			editEntityRecord(kind, name, recordId, resetEdits, {
				undoIgnore: true,
			});
		});
	};

	const save = async ({ successMessage }) => {
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
		discard,
	};
}
