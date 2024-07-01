/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { settings as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	edit,
	save,
	icon,
});
