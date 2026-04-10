/**
 * SPA Shell — Unified entry point for SPA-enabled SureCart admin pages.
 *
 * This single entry mounts a React root that handles all SPA pages
 * (Products, Collections, etc.) with client-side routing between them.
 */
import { createRoot } from '@wordpress/element';
import '../store/add-entities';
import SpaShell from './SpaShell';

const container = document.getElementById('sc-admin-spa-app');
if (container) {
	const root = createRoot(container);
	root.render(<SpaShell />);
}
