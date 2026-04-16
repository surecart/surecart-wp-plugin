/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { list as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Register the block.
 */
registerBlockType(metadata.name, {
	edit,
	icon,
});
