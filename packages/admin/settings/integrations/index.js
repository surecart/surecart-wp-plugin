import { createRoot } from '@wordpress/element';
import ErrorBoundary from '../../components/error-boundary';
import '../store';

import Settings from './Integrations';
import { RouterProvider, NavigationGuardProvider } from '../../router';

const root = createRoot(document.getElementById('app'));
root.render(
	<ErrorBoundary>
		<RouterProvider>
			<NavigationGuardProvider>
				<Settings />
			</NavigationGuardProvider>
		</RouterProvider>
	</ErrorBoundary>
);
