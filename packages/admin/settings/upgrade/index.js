import { render } from '@wordpress/element';
import ErrorBoundary from '../../components/error-boundary';
import '../store';

import Settings from './UpgradeSettings';

render(
	<ErrorBoundary>
		<Settings />
	</ErrorBoundary>,
	document.getElementById('app')
);
