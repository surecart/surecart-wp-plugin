/**
 * External dependencies.
 */
import { createRoot } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App.
 */
import ReviewsApp from './ReviewsApp';

/**
 * Render.
 */
const container = document.getElementById('sc-reviews-app');
if (container) {
	createRoot(container).render(<ReviewsApp />);
}
