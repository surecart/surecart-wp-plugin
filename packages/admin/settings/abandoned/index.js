import { render } from '@wordpress/element';
import ErrorBoundary from '../../components/error-boundary';
import '../../store/add-entities';

import Settings from './AbandonedSettings';

render(
	<ErrorBoundary>
		<Settings />
	</ErrorBoundary>,
	document.getElementById('app')
);
