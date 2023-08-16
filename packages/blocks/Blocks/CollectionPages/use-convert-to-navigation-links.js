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
export function createNavigationLinks( pages = [] ) {
	const linkMap = {};
	const navigationLinks = [];
	pages?.forEach( ( { id, name, permalink } ) => {
		linkMap[ id ] = createBlock(
			'core/navigation-link',
			{
				id,
				label: name,
				url: permalink,
				page: 'page',
				kind: 'post-type',
			}
		);

		navigationLinks.push( linkMap[ id ] );
	} );
	return navigationLinks;
}


