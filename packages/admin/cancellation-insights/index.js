import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import CancellationInsights from './CancellationInsights';

/**
 * Render
 */
const app = document.getElementById('app');
if (app) {
	render(<CancellationInsights />, document.getElementById('app'));
}
