/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { plus as icon } from '@wordpress/icons';

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
