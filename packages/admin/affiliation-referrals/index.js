/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import AffiliationReferral from './AffiliationReferral';
import { createRoot } from '@wordpress/element';

/**
 * Render
 */
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AffiliationReferral />);
