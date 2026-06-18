/**
 * WordPress dependencies
 */
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { select, useDispatch, useSelect } from '@wordpress/data';
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
	const [pending, setPending] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	// retryRef holds the tx.retry() function from history.block() for browser back navigation.
	const retryRef = useRef(null);
	const unblockRef = useRef(null);

	// Save message a page registers, for the browser-back path which can't pass one.
	const defaultSuccessMessageRef = useRef(null);

	const { save, discard } = useSave();
	const { createErrorNotice } = useDispatch(noticesStore);

	const hasDirtyRecords = useSelect((select) => {
		return (
			select(coreStore).__experimentalGetDirtyEntityRecords().length > 0
		);
	}, []);

	// Intercept browser back/forward when there are unsaved changes.
	useEffect(() => {
		if (!hasDirtyRecords) {
			return;
		}

		unblockRef.current = history.block((tx) => {
			retryRef.current = tx.retry;
			setPending({
				params: null,
				successMessage: defaultSuccessMessageRef.current,
			});
		});

		return () => {
			unblockRef.current?.();
			unblockRef.current = null;
		};
	}, [hasDirtyRecords]);

	const closeDialog = useCallback(() => {
		setPending(null);
		retryRef.current = null;
		setIsSaving(false);
	}, []);

	const navigateToPending = useCallback(() => {
		// Unblock before navigating so our push/retry isn't intercepted again.
		unblockRef.current?.();
		unblockRef.current = null;

		if (retryRef.current) {
			// Browser back button: resume the blocked navigation.
			retryRef.current();
			retryRef.current = null;
		} else if (pending?.params) {
			history.push(pending.params);
			window.scrollTo(0, 0);
		}
		closeDialog();
	}, [pending, closeDialog]);

	const requestNavigation = useCallback((params, { successMessage } = {}) => {
		const dirtyRecords =
			select(coreStore).__experimentalGetDirtyEntityRecords();

		if (dirtyRecords.length > 0) {
			setPending({ params, successMessage });
			return;
		}

		history.push(params);
		window.scrollTo(0, 0);
	}, []);

	// Ref, not state: only navigation handlers read it, never the render.
	const setDefaultSuccessMessage = useCallback((message) => {
		defaultSuccessMessageRef.current = message;
	}, []);

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
				successMessage:
					pending?.successMessage ||
					__('Settings saved.', 'surecart'),
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
	}, [save, pending, navigateToPending, createErrorNotice]);

	const contextValue = useMemo(
		() => ({
			requestNavigation,
			setDefaultSuccessMessage,
		}),
		[requestNavigation, setDefaultSuccessMessage]
	);

	return (
		<NavigationConfirmContext.Provider value={contextValue}>
			{children}
			{pending && (
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
