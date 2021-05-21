/**
 * External dependencies
 */
import { registerBlockType, createBlock, serialize } from '@wordpress/blocks';

/**
 * Internal dependencies.
 */
import { name, settings } from '../index';

// Make variables accessible for all tests.
let block;
let serializedBlock;

describe( 'checkout-engine/buttons', () => {
	beforeAll( () => {
		// Register the block.
		registerBlockType( name, { category: 'common', ...settings } );
	} );

	beforeEach( () => {
		// Create the block with the minimum attributes.
		block = createBlock( name );

		// Reset the reused variables.
		serializedBlock = '';
	} );
	it( 'Should render with defaults', () => {
		serializedBlock = serialize( block );
		expect( serializedBlock ).toBeDefined();
		expect( serializedBlock ).toContain( `<presto-button` );
		expect( serializedBlock ).toContain( `type="primary"` );
		expect( serializedBlock ).toContain( `size="large"` );
		expect( serializedBlock ).toContain( `Purchase` );
	} );

	it( 'should render with types', () => {
		[
			'default',
			'primary',
			'success',
			'info',
			'warning',
			'danger',
		].forEach( ( type ) => {
			block.attributes.type = type;
			serializedBlock = serialize( block );
			expect( serializedBlock ).toBeDefined();
			expect( serializedBlock ).toContain( `type="${ type }"` );
			expect( serializedBlock ).toMatchSnapshot();
		} );
	} );

	it( 'should render with custom class name', () => {
		block.attributes.className = 'my-custom-class';
		serializedBlock = serialize( block );

		expect( serializedBlock ).toBeDefined();
		expect( serializedBlock ).toContain( 'my-custom-class' );
		expect( serializedBlock ).toMatchSnapshot();
	} );
} );
