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
export function createNavigationLink( {id, name, permalink } ) {
	console.log(id);
	return createBlock(
		'core/navigation-link',
		{
			id,
			label: name,
			url: permalink,
			page: 'page',
			kind: 'post-type',
		}
	);
}

function stringToSlug(input) {
	return input
		.toLowerCase() // Convert to lowercase
		.replace(/\s+/g, '-') // Replace spaces with dashes
		.replace(/[^\w\-]+/g, '') // Remove non-word characters except dashes
		.replace(/\-\-+/g, '-') // Replace multiple dashes with a single dash
		.replace(/^-+/, '') // Remove any leading dashes
		.replace(/-+$/, ''); // Remove any trailing dashes
}


