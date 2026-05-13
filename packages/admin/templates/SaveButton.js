/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { ScButton, ScSkeleton } from '@surecart/components-react';
import { isKeepBusy } from '../settings/UseSave';

export default function SaveButton({ onSave, children, busy, loading }) {
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

	// Stay busy if saving, prop is set, or save() was called with keepBusy.
	const effectiveBusy = isSaving || busy || isKeepBusy();
	const disabled = !isDirty || isSaving;

	if (loading) {
		return (
			<ScSkeleton
				style={{
					width: '120px',
					height: '35px',
					display: 'inline-block',
				}}
			></ScSkeleton>
		);
	}

	return (
		<ScButton
			type="primary"
			submit
			aria-disabled={disabled}
			disabled={disabled || effectiveBusy}
			busy={effectiveBusy}
			onClick={disabled ? undefined : onSave}
		>
			{children}
		</ScButton>
	);
}
