import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import SubscriptionInsights from './SubscriptionInsights';

/**
 * App
 */
import '../store/add-entities';

/**
 * Render
 */
const app = document.getElementById('app');
if (app) {
	render(<SubscriptionInsights />, document.getElementById('app'));
}
