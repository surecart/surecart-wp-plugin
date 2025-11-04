/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { postContent as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Register block.
 */
registerBlockType(metadata, {
	icon,
	edit,
});
