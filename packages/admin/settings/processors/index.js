import { render } from '@wordpress/element';

import ErrorBoundary from '../../components/error-boundary';
import Settings from './ProcessorSettings';

import '../store';

render(
	<ErrorBoundary>
		<Settings />
	</ErrorBoundary>,
	document.getElementById('app')
);
