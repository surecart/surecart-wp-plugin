import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../../store/add-entities';

/**
 * App
 */
import EditSubscription from './EditSubscription';

/**
 * Render
 */
render(<EditSubscription />, document.getElementById('app'));
