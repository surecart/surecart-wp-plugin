/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

// Register block category
import './utils/block-category';

// Extensions
// import './extensions/animation';
// import './extensions/colors/inspector';
// import './extensions/typography';
// import './extensions/attributes';
// import './extensions/advanced-controls';
// import './extensions/padding-controls';
// import './extensions/list-styles';
// import './extensions/button-styles';
// import './extensions/button-controls';
// import './extensions/image-styles';
// import './extensions/cover-styles';
// import './extensions/media-text-styles';
// import './extensions/lightbox-controls';
// import './extensions/replace-image';
// import './extensions/image-crop';
// import './extensions/image-filter';
// import './extensions/Checkout Engine-settings/';
// import './extensions/layout-selector';
// import './extensions/block-patterns';

// Categories Helper
import { supportsCollections } from './utils/block-helpers';

// Register Blocks
import * as checkout from './blocks/checkout';

// sections
import * as pricingSection from './blocks/sections/pricing-section';
import * as totalsSection from './blocks/sections/totals-section';
import * as contactSection from './blocks/sections/contact-section';

// blocks
import * as section from './blocks/section';
import * as email from './blocks/email';
import * as name from './blocks/name';
import * as button from './blocks/button';
import * as submit from './blocks/submit';
import * as input from './blocks/input';

/**
 * Function to register an individual block.
 *
 * @param {Object} block The block to be registered.
 *
 */
const registerBlock = ( block ) => {
	if ( ! block ) {
		return;
	}

	let { category } = block;

	const { name, settings } = block;

	if ( ! supportsCollections() ) {
		category = 'checkout-engine';
	}

	registerBlockType( name, {
		category,
		...settings,
	} );
};

/**
 * Function to register blocks provided by Checkout Engine.
 */
export const registerCheckoutEngineBlocks = () => {
	[
		checkout,
		section,
		pricingSection,
		totalsSection,
		contactSection,
		submit,
		button,
		input,
		name,
		email,
	].forEach( registerBlock );
};

registerCheckoutEngineBlocks();
