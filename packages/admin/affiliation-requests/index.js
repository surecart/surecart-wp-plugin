/**
 * External dependencies.
 */
import { createRoot } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import AffiliationRequest from './AffiliationRequest';

/**
 * Render
 */
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AffiliationRequest />);
