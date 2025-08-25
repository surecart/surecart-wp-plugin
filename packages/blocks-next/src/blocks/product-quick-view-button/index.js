/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { button as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import './editor.scss';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit,
});
