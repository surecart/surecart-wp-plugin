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
 *
 * Bundles share the Product entity and the EditProduct UI — bundle-specific
 * UI (e.g. the BundleItems module) is gated on `product?.bundle` inside
 * EditProduct. The bundle list/index screen is rendered server-side via the
 * PHP `BundlesListTable`, so there is no `Bundles.js` list page here.
 */
import EditBundle from './EditBundle';

/**
 * Render.
 */
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<EditBundle />);
