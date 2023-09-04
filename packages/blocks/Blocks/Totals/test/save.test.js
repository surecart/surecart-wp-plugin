/**
 * External dependencies
 */
import { registerBlockType, createBlock, serialize } from '@wordpress/blocks';

/**
 * Internal dependencies.
 */
import { name, settings } from '../index';

//make variables accessible to all tests
let block;
let serializedBlock;

describe('surecart/totals', () => {
	beforeAll(() => {
		//register the block
		registerBlockType(name, {
			category: 'common',
			...settings,
		});
	});

	beforeEach(() => {
		// Create the block with the minimum attributes.
		block = createBlock(name);

		// Reset the reused variables.
		serializedBlock = '';
	});

	it('should render with defaults', () => {
		serializedBlock = serialize(block);
		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toContain(`wp:surecart/totals`);
	});

	it('deprecation: should render with collapsible, collapsed by default, collapsed on mobile', () => {
		block.attributes.collapsible = true;
		block.attributes.collapsedByDefault = true;
		block.attributes.collapsedOnMobile = true;
		serializedBlock = serialize(block);

		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toContain('wp:surecart/totals');
		expect(serializedBlock).toContain('collapsible');
		expect(serializedBlock).toContain('collapsed-by-default');
		expect(serializedBlock).toContain('collapsed-on-mobile');
		expect(serializedBlock).toMatchSnapshot();
	});

	it('deprecation: should render with collapsible, collapsed by default, open on mobile', () => {
		block.attributes.collapsible = true;
		block.attributes.collapsedByDefault = true;
		block.attributes.openOnMobile = false;
		serializedBlock = serialize(block);

		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toContain('wp:surecart/totals');
		expect(serializedBlock).toContain('collapsible');
		expect(serializedBlock).toContain('collapsed-by-default');
		expect(serializedBlock).not.toContain('collapsed-on-mobile');
		expect(serializedBlock).toMatchSnapshot();
	});

	it('deprecation: should render with collapsible, open by default, collapsed on mobile', () => {
		block.attributes.collapsible = true;
		block.attributes.collapsedByDefault = false;
		block.attributes.openOnMobile = true;
		serializedBlock = serialize(block);

		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toContain('wp:surecart/totals');
		expect(serializedBlock).toContain('collapsible');
		expect(serializedBlock).toContain('collapsed-on-mobile');
		expect(serializedBlock).toMatchSnapshot();
	});

	it('deprecation: should render with collapsible, open by default, open on mobile', () => {
		block.attributes.collapsible = true;
		block.attributes.collapsedByDefault = false;
		block.attributes.collapsedOnMobile = false;

		serializedBlock = serialize(block);
		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toMatchSnapshot();
	});

	it('deprecation: should render with not collapsible, open by default, open on mobile', () => {
		block.attributes.collapsible = false;
		block.attributes.collapsedByDefault = false;
		block.attributes.collapsedOnMobile = false;
		serializedBlock = serialize(block);

		expect(serializedBlock).toBeDefined();
		expect(serializedBlock).toMatchSnapshot();
	});
});
