/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { buttons as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	edit,
	save,
	icon,
});
