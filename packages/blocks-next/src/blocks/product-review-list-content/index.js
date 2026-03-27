/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { columns as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
	icon,
	edit,
	save,
});
