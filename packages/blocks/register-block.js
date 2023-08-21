import {
	getBlockType,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

/**
 * Function to register blocks provided by SureCart.
 */
export const registerBlocks = (blocks = []) =>
	(blocks || []).forEach(registerBlock);

/**
 * Function to unregister blocks provided by SureCart.
 */
export const unregisterBlocks = (blocks = []) =>
	(blocks || [])
		.filter((block) => block?.name)
		.map((block) => block.name)
		.forEach((name) => getBlockType(name) && unregisterBlockType(name));

/**
 * Function to register an individual block.
 *
 * @param {Object} block The block to be registered.
 *
 */
const registerBlock = (block) => {
	if (!block) {
		return;
	}

	const { metadata, settings } = block;

	registerBlockType(
		{
			...metadata,
			textdomain: 'surecart', // set our textdomain for everything.
		},
		{
			...settings,
			// title: metadata.title || settings.title,
		}
	);
};
