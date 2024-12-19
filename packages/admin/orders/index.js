import { render } from '@wordpress/element';
/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import Order from './Order';

/**
 * Render
 */

const registerAddon = window.surecart.registerAddon;
registerAddon('custom-main', {
	render: () => <div>Test Custom Main</div>,
	scope: 'main',
});

registerAddon('custom-sidebar', {
	render: () => <div>Test Custom Sidebar</div>,
	scope: 'sidebar',
});

render(<Order />, document.getElementById('app'));
