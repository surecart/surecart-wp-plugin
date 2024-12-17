import { render } from '@wordpress/element';
import { Fill, SlotFillProvider } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import Order from './Order';

const MyCustomSidebarComponent = () => (
	<Fill name="sc-view-orders-sidebar-end">
		<div className="my-custom-sidebar-component">
			<h2>{__('My Custom Sidebar Component', 'my-plugin-textdomain')}</h2>
			<p>
				{__(
					'This is some custom content added to the sidebar.',
					'my-plugin-textdomain'
				)}
			</p>
		</div>
	</Fill>
);
/**
 * Render
 */
render(
	<SlotFillProvider>
		<Order />
		<MyCustomSidebarComponent />
	</SlotFillProvider>,
	document.getElementById('app')
);
