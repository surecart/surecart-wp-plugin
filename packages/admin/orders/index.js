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
	title: 'Test Custom Main 1',
});

registerAddon('custom-main-tow', {
	render: () => <div>Test Custom Main</div>,
	scope: 'main',
	title: 'Test Custom Main 2',
});

registerAddon('custom-sidebar', {
	render: () => <div>Test Custom Sidebar</div>,
	scope: 'sidebar',
	title: 'Test Custom Sidebar',
});

registerAddon('custom-sidebar-two', {
	render: () => <div>Test Custom Sidebar</div>,
	scope: 'sidebar',
	title: 'Test Custom Sidebar 2',
});

render(<Order />, document.getElementById('app'));
