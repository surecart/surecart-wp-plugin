import { createRoot } from '@wordpress/element';
import ErrorBoundary from '../../components/error-boundary';
import '../store';

import Settings from './DisplayCurrencySettings';

const root = createRoot(document.getElementById('app'));
root.render(
	<ErrorBoundary>
		<Settings />
	</ErrorBoundary>
);
