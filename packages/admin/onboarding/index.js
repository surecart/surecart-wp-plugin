import { render } from '@wordpress/element';

/**
 * App
 */
import Onboarding from './Onboarding';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
render(<Onboarding />, document.getElementById('app'));
