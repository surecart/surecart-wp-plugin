/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import AffiliationRequest from './AffiliationRequest';
import { render } from '@wordpress/element';

/**
 * Render
 */
render(<AffiliationRequest />, document.getElementById('app'));
