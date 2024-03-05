/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import AffiliationReferral from './AffiliationReferral';
import { render } from '@wordpress/element';

/**
 * Render
 */
render(<AffiliationReferral />, document.getElementById('app'));
