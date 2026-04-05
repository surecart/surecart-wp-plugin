/**
 * WordPress dependencies.
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import '../store/add-entities';
import ErrorBoundary from '../components/error-boundary';
import { RouterProvider, NavigationGuardProvider } from '../router';
import SettingsApp from './SettingsApp';

const container = document.getElementById('sc-settings-app');

if (container) {
	const root = createRoot(container);
	root.render(
		<ErrorBoundary>
			<RouterProvider>
				<NavigationGuardProvider>
					<SettingsApp />
				</NavigationGuardProvider>
			</RouterProvider>
		</ErrorBoundary>
	);
}
