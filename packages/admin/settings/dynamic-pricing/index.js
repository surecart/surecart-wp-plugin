import { createRoot } from '@wordpress/element';
import ErrorBoundary from '../../components/error-boundary';
import '../store';

import Settings from './DynamicPricingSettings';

createRoot(document.getElementById('app')).render(
	<ErrorBoundary>
		<Settings />
	</ErrorBoundary>
);
