/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { icon as iconSymbol } from '@wordpress/icons';

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
	icon: iconSymbol,
	edit,
});
