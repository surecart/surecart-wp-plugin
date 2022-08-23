import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default () => {
	const { saveEditedEntityRecord } = useDispatch(coreStore);
	const saveDirtyRecords = async () => {
		// build up pending records to save.
		const dirtyRecords =
			select(coreStore).__experimentalGetDirtyEntityRecords();
		const pendingSavedRecords = [];
		dirtyRecords.forEach(({ kind, name, key }) => {
			pendingSavedRecords.push(saveEditedEntityRecord(kind, name, key));
		});

		// check values.
		const values = await Promise.all(pendingSavedRecords);
		if (values.some((value) => typeof value === 'undefined')) {
			throw new Error('Saving failed.');
		}

		return values;
	};

	return {
		saveDirtyRecords,
	};
};
