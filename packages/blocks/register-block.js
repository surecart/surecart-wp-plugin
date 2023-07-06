import { registerBlockType } from '@wordpress/blocks';

/**
 * Function to register blocks provided by SureCart.
 */
export const registerBlocks = (blocks = []) => {
	return (blocks || []).forEach(registerBlock);
};

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
