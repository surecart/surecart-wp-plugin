/**
 * WordPress dependencies
 */
import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import {
	Modal,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import history from './history';

/**
 * Default context value — plain navigation with no dirty-record check.
 * Used when no NavigationGuardProvider is in the tree so useLink
 * still works on every admin page without crashing.
 */
const NavigationGuardContext = createContext({
	navigate: (params) => {
		history.push(params);
		window.scrollTo(0, 0);
	},
});

/**
 * Hook to access the guarded navigation function.
 *
 * @return {Object} Object with `navigate` function that checks for dirty records before navigating.
 */
export function useNavigationGuard() {
	return useContext(NavigationGuardContext);
}

/**
 * Get all dirty entity records from the core-data store.
 *
 * @return {Array} Array of dirty entity records.
 */
function getDirtyRecords() {
	return select(coreStore).__experimentalGetDirtyEntityRecords();
}

/**
 * Provider that intercepts navigation when there are unsaved changes.
 * Shows a dialog with Save / Discard / Cancel options.
 *
 * @param {Object}  props          Component props.
 * @param {Element} props.children Child components.
 * @return {Element} The provider with dialog.
 */
export function NavigationGuardProvider({ children }) {
	const [pendingNavigation, setPendingNavigation] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const { saveEditedEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	/**
	 * Navigate to a new route. If there are unsaved changes,
	 * show a confirmation dialog instead of navigating immediately.
	 */
	const navigate = useCallback((params) => {
		const dirtyRecords = getDirtyRecords();
		if (dirtyRecords.length > 0) {
			setPendingNavigation(params);
		} else {
			history.push(params);
			window.scrollTo(0, 0);
		}
	}, []);

	/**
	 * Save all dirty records, then navigate to the pending route.
	 */
	const handleSave = useCallback(async () => {
		const params = pendingNavigation;
		setIsSaving(true);

		try {
			const dirtyRecords = getDirtyRecords();
			const pending = dirtyRecords.map(({ kind, name, key }) =>
				saveEditedEntityRecord(kind, name, key, {
					throwOnError: true,
				})
			);

			const values = await Promise.all(pending);
			if (values.some((value) => typeof value === 'undefined')) {
				throw new Error(__('Saving failed.', 'surecart'));
			}

			createSuccessNotice(__('Settings saved.', 'surecart'), {
				type: 'snackbar',
			});

			setPendingNavigation(null);
			history.push(params);
			window.scrollTo(0, 0);
		} catch (error) {
			createErrorNotice(
				error?.message || __('Saving failed.', 'surecart'),
				{ type: 'snackbar' }
			);
		} finally {
			setIsSaving(false);
		}
	}, [
		pendingNavigation,
		saveEditedEntityRecord,
		createSuccessNotice,
		createErrorNotice,
	]);

	/**
	 * Discard changes by doing a full page navigation (clears in-memory state).
	 */
	const handleDiscard = useCallback(() => {
		const params = pendingNavigation;
		setPendingNavigation(null);

		// Build the URL and do a full page load to discard in-memory edits.
		const url = new URL(window.location.href);
		// Clear existing params and set the new ones.
		url.search = '';
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				url.searchParams.set(key, value);
			}
		});

		// Tell UnsavedChangesWarning to skip the beforeunload prompt —
		// the user already confirmed they want to discard.
		window.__surecartSkipUnloadWarning = true;
		window.location.href = url.toString();
	}, [pendingNavigation]);

	/**
	 * Cancel navigation and stay on the current tab.
	 */
	const handleCancel = useCallback(() => {
		setPendingNavigation(null);
	}, []);

	return (
		<NavigationGuardContext.Provider value={{ navigate }}>
			{children}
			{pendingNavigation && (
				<Modal
					title={__('Unsaved changes', 'surecart')}
					onRequestClose={handleCancel}
					isDismissible={!isSaving}
					size="small"
				>
					<p>
						{__(
							'You have unsaved changes. Would you like to save them before navigating away?',
							'surecart'
						)}
					</p>
					<HStack justify="space-between">
						<Button
							variant="tertiary"
							onClick={handleCancel}
							disabled={isSaving}
						>
							{__('Cancel', 'surecart')}
						</Button>
						<HStack justify="right" gap={2}>
							<Button
								variant="secondary"
								isDestructive
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
						</HStack>
					</HStack>
				</Modal>
			)}
		</NavigationGuardContext.Provider>
	);
}
