import { render } from '@wordpress/element';
import ErrorBoundary from '../../components/error-boundary';
import '../store';
import './store/register';

import Settings from './TaxRegionSettings';

render(
	<ErrorBoundary>
		<Settings />
	</ErrorBoundary>,
	document.getElementById('app')
);
