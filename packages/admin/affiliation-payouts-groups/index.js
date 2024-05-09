/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import AffiliationPayoutGroup from './AffiliationPayoutGroup';
import { render } from '@wordpress/element';

/**
 * Render
 */
render(<AffiliationPayoutGroup />, document.getElementById('app'));
