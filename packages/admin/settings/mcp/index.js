import { createRoot } from '@wordpress/element';
import ErrorBoundary from '../../components/error-boundary';
import '../store';

import Settings from './MCPSettings';

const root = createRoot(document.getElementById('app'));
root.render(
	<ErrorBoundary>
		<Settings />
	</ErrorBoundary>
);
