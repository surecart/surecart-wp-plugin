/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Converts an array of pages into a nested array of navigation link blocks.
 *
 * @param {Array} pages An array of pages.
 *
 * @return {Array} A nested array of navigation link blocks.
 */
export function createNavigationLink({ id, name, permalink }) {
	return createBlock('core/navigation-link', {
		id,
		label: name,
		url: permalink,
		page: 'page',
		kind: 'sc-collection',
	});
}
