/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';
import './styles.scss';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	edit,
	save,
});
