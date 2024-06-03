/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { grid as icon } from '@wordpress/icons';
import { BlockReplacer } from './BlockReplacer';
/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit: ({ clientId, attributes }) => (
		<BlockReplacer
			clientId={clientId}
			attributes={attributes}
			blockType="surecart/product-list"
		/>
	),
	save,
};
