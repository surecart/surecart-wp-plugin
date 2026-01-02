/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { sidebar as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Style.
 */
import './style.scss';

registerBlockType(metadata.name, {
	icon,
	edit,
	save,
});
