import { render } from '@wordpress/element';
import { store as dataStore } from '../store/data';
import { dispatch } from '@wordpress/data';

import './store/register';

dispatch( dataStore ).registerEntities( [
	{
		name: 'products',
		baseURL: 'products',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'prices',
		baseURL: 'prices',
		baseURLParams: { context: 'edit' },
	},
] );

/**
 * App
 */
import Product from './Product';

/**
 * Render
 */
render( <Product />, document.getElementById( 'app' ) );
