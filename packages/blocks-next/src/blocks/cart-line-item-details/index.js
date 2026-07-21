/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { list as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
	edit,
	save,
	icon,
});
