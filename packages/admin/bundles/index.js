/**
 * External dependencies.
 */
import { createRoot } from '@wordpress/element';

/**
 * Register store and entities. Bundles reuse the `product` entity.
 */
import '../store/add-entities';

/**
 * App — list/edit/create SPA for `?page=sc-bundles`.
 */
import BundlesApp from './BundlesApp';

/**
 * Render.
 */
const container = document.getElementById('sc-bundles-app');
if (container) {
	const root = createRoot(container);
	root.render(<BundlesApp />);
}
