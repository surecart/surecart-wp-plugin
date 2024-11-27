/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { grid as icon } from '@wordpress/icons';
import ListBlockMigration from '../../components/ListBlockMigration';
/**
 * Internal dependencies
 */
import save from './save';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit: ({ clientId, attributes }) => (
		<ListBlockMigration
			clientId={clientId}
			attributes={attributes}
			blockType="surecart/product-list"
		/>
	),
	save,
};
