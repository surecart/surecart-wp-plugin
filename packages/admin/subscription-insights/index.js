import { createRoot } from '@wordpress/element';

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
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<SubscriptionInsights />);
