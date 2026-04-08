/**
 * createListRoot — Factory to mount a DataView list page component.
 *
 * @example
 * // packages/admin/orders/orders-list-root.js
 * import createListRoot from '../components/dataview-list/createListRoot';
 * import OrdersList from './OrdersList';
 * createListRoot( 'sc-orders-list-app', OrdersList );
 *
 * @param {string}            mountId   - DOM element ID to mount into (e.g. 'sc-orders-list-app').
 * @param {React.ComponentType} Component - The list page component to render.
 */
import { createRoot } from '@wordpress/element';
import '../../store/add-entities';

export default function createListRoot( mountId, Component ) {
	const container = document.getElementById( mountId );
	if ( container ) {
		const root = createRoot( container );
		root.render( <Component /> );
	}
}
