import { createRegistrySelector } from '@wordpress/data';
import { STORE_KEY } from './index';

export const selectProduct = createRegistrySelector( ( select ) => ( id ) =>
	select( STORE_KEY ).selectModelByID( 'products', id )
);
