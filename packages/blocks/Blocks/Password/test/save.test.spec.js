/**
 * External dependencies
 */
import { registerBlockType, createBlock, serialize } from '@wordpress/blocks';

/**
 * Internal dependencies.
 */
import * as blockData from '../index';
const { metadata, settings } = blockData;

// Make variables accessible for all tests.
let block;
let serializedBlock;

describe('surecart/buttons', () => {
	beforeAll(() => {
		registerBlockType(metadata, settings);
	});

	beforeEach(() => {
		// Create the block with the minimum attributes.
		block = createBlock(metadata.name);

		// Reset the reused variables.
		serializedBlock = '';
	});
	it('Should render with defaults', () => {
		serializedBlock = serialize(block);
		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toContain(`wp:surecart/password`);
	});

	it('should render with custom class name', () => {
		block.attributes.className = 'my-custom-class';
		serializedBlock = serialize(block);
		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toContain('my-custom-class');
		expect(serializedBlock).toMatchSnapshot();
	});

	it('can be required', () => {
		block.attributes.required = true;
		serializedBlock = serialize(block);
		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toContain(`{\"required\":true}`);
		expect(serializedBlock).toMatchSnapshot();
	});
});
