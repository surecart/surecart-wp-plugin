/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { shadow as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';

/**
 * Styles.
 */
import './style.scss';
import './editor.scss';

registerBlockType('surecart/icon', {
	icon,
	edit,
});
