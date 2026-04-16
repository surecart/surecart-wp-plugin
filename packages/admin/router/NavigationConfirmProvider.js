/**
 * WordPress dependencies
 */
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { Button, Modal } from '@wordpress/components';

/**
 * Internal dependencies
 */
import history from './history';
import useSave from '../settings/UseSave';

const NavigationConfirmContext = createContext(undefined);

export function NavigationConfirmProvider({ children }) {
	const [pendingParams, setPendingParams] = useState(null);
	const [isSaving, setIsSaving] = useState(false);

	const { save, discard } = useSave();
	const { createErrorNotice } = useDispatch(noticesStore);

	const closeDialog = useCallback(() => {
		setPendingParams(null);
		setIsSaving(false);
	}, []);

	const navigateToPending = useCallback(() => {
		if (pendingParams) {
			history.push(pendingParams);
			window.scrollTo(0, 0);
		}
		closeDialog();
	}, [pendingParams, closeDialog]);

	const requestNavigation = useCallback(
		(params) => {
			const dirtyRecords =
				select(coreStore).__experimentalGetDirtyEntityRecords();

			if (dirtyRecords.length > 0) {
				setPendingParams(params);
				return;
			}

			history.push(params);
			window.scrollTo(0, 0);
		},
		[]
	);

	const handleDismiss = useCallback(() => {
		if (isSaving) {
			return;
		}
		closeDialog();
	}, [isSaving, closeDialog]);

	const handleDiscard = useCallback(() => {
		discard();
		navigateToPending();
	}, [discard, navigateToPending]);

	const handleSave = useCallback(async () => {
		setIsSaving(true);
		try {
			await save({
				successMessage: __('Settings saved.', 'surecart'),
			});
			navigateToPending();
		} catch (error) {
			const message =
				error?.message ||
				__(
					'Something went wrong when saving. Please try again.',
					'surecart'
				);
			createErrorNotice(message, {
				type: 'snackbar',
			});
		} finally {
			setIsSaving(false);
		}
	}, [save, navigateToPending, createErrorNotice]);

	const contextValue = useMemo(
		() => ({
			requestNavigation,
		}),
		[requestNavigation]
	);

	return (
		<NavigationConfirmContext.Provider value={contextValue}>
			{children}
			{pendingParams && (
				<Modal
					contentLabel={__('Unsaved changes', 'surecart')}
					__experimentalHideHeader
					onRequestClose={handleDismiss}
					shouldCloseOnEsc={!isSaving}
					shouldCloseOnClickOutside={!isSaving}
				>
					<p>
						{__(
							'You have unsaved changes. Save before leaving, or discard them and continue?',
							'surecart'
						)}
					</p>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: '12px',
							flexWrap: 'wrap',
							marginTop: '16px',
						}}
					>
						<Button
							variant="tertiary"
							onClick={handleDismiss}
							disabled={isSaving}
						>
							{__('Cancel', 'surecart')}
						</Button>
						<div
							style={{
								display: 'flex',
								gap: '12px',
								flexWrap: 'wrap',
							}}
						>
							<Button
								variant="tertiary"
								onClick={handleDiscard}
								disabled={isSaving}
							>
								{__('Discard', 'surecart')}
							</Button>
							<Button
								variant="primary"
								onClick={handleSave}
								isBusy={isSaving}
								disabled={isSaving}
							>
								{__('Save', 'surecart')}
							</Button>
						</div>
					</div>
				</Modal>
			)}
		</NavigationConfirmContext.Provider>
	);
}

export function useNavigationConfirm() {
	const context = useContext(NavigationConfirmContext);
	if (context === undefined) {
		throw new Error(
			'useNavigationConfirm must be used within a NavigationConfirmProvider'
		);
	}
	return context;
}
