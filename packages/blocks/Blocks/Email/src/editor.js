/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { verse as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from '../edit';
import save from '../save';
import metadata from '../block.json';

registerBlockType(metadata, {
	icon,
	edit,
	save,
});
