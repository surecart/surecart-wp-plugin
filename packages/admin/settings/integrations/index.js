import { createRoot } from '@wordpress/element';
import ErrorBoundary from '../../components/error-boundary';
import '../store';

import Settings from './Integrations';
import { RouterProvider } from '../../router';

const root = createRoot(document.getElementById('app'));
root.render(
	<ErrorBoundary>
		<RouterProvider>
			<Settings />
		</RouterProvider>
	</ErrorBoundary>
);
