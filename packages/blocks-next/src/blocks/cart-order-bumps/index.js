/**
 * External dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { box as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import './style.scss';
import './editor.scss';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit,
	save,
});
