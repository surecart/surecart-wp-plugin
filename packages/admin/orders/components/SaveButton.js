/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@surecart/data';
import { ScButton } from '@surecart/components-react';

export default function SaveButton({ children, isSaving }) {
	const isDirty = useSelect((select) => {
		const dirtyEntityRecords = select(coreStore).selectDirty();
		const draftEntries = select(coreStore).selectAllDrafts();
		if (draftEntries.length > 0) return true;
		if (Object.keys(dirtyEntityRecords || {}).length > 0) return true;
		return false;
	}, []);

	console.log({ isDirty });

	const disabled = !isDirty || isSaving;

	return (
		<ScButton
			type="primary"
			submit
			style={{ '--button-border-radius': '2px' }}
			aria-disabled={disabled}
			disabled={disabled || isSaving}
			busy={isSaving}
		>
			{children}
		</ScButton>
	);
}
