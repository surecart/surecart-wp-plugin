/**
 * External dependencies
 */
import TestRenderer from 'react-test-renderer';

import { useSelect } from '@wordpress/data';

jest.mock( '@wordpress/data' );

/**
 * Internal dependencies
 */
import BrowserURL, { getEditURL } from '../index.js';

describe( 'getEditURL', () => {
	it( 'should generate relative path with post and action arguments', () => {
		const url = getEditURL( 1 );
		expect( url ).toBe( 'http://localhost/?id=1' );
	} );
} );

describe( 'BrowserURL', () => {
	let replaceStateSpy;

	beforeAll( () => {
		replaceStateSpy = jest.spyOn( window.history, 'replaceState' );
	} );

	beforeEach( () => {
		replaceStateSpy.mockReset();
	} );

	afterAll( () => {
		replaceStateSpy.mockRestore();
	} );

	it( 'should not update url if there is no id.', () => {
		useSelect.mockImplementation( () => ( {} ) );
		TestRenderer.create( <BrowserURL /> );
		expect( true ).toBeTruthy();
		expect( replaceStateSpy ).not.toHaveBeenCalled();
	} );

	it( 'should update url if id is set.', () => {
		useSelect.mockImplementation( () => ( { id: 'asdf' } ) );
		TestRenderer.create( <BrowserURL /> );
		expect( true ).toBeTruthy();
		expect( replaceStateSpy ).toHaveBeenCalled();
	} );
} );
