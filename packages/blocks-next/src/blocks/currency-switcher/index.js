/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { currencyDollar as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Styles.
 */
import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit,
});
