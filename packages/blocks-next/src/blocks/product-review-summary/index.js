/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { starFilled as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Register block.
 */
registerBlockType(metadata, {
	icon,
	edit,
	save,
});
