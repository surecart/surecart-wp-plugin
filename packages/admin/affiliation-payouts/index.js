/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import AffiliationPayout from './AffiliationPayout';
import { render } from '@wordpress/element';

/**
 * Render
 */
render(<AffiliationPayout />, document.getElementById('app'));
