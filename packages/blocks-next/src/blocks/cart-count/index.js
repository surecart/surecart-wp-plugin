/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { queryPaginationNext as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit,
});
