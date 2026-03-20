/**
 * External dependencies.
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import ErrorBoundary from '../../components/error-boundary';
import Settings from './ReviewProtocolSettings';
import '../store';

/**
 * Render.
 */
const container = document.getElementById('app');
const root = createRoot(container);
root.render(
	<ErrorBoundary>
		<Settings />
	</ErrorBoundary>
);
