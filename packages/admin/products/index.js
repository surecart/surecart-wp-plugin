import { createRoot } from '@wordpress/element';

/**
 * App
 */
import Product from './Product';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render — only mount if the legacy #app element exists AND the SPA shell is not active.
 *
 * When the SPA shell handles all views (list, create, edit), the #app element
 * won't be in the DOM — except when SettingsApp creates an #app div inside
 * its own layout. We must NOT mount on that unrelated #app.
 */
const spaShellActive = document.getElementById('sc-admin-spa-app');
const container = !spaShellActive && document.getElementById('app');
if (container) {
	const root = createRoot(container);
	root.render(<Product />);
}
