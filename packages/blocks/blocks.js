/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType, registerBlockCollection } from '@wordpress/blocks';

// Register block collection
registerBlockCollection( 'checkout-engine', {
	title: __( 'Checkout Engine', 'checkout_engine' ),
} );

// sections
import * as pricingSection from './blocks/sections/pricing-section';
import * as paymentSection from './blocks/sections/payment-section';
import * as contactSection from './blocks/sections/contact-section';

// blocks
import * as checkout from './blocks/checkout';
import * as section from './blocks/section';
import * as email from './blocks/email';
import * as total from './blocks/total';
import * as subtotal from './blocks/subtotal';
import * as totals from './blocks/totals';
import * as name from './blocks/name';
import * as payment from './blocks/payment';
import * as paymentRequest from './blocks/payment-request';
import * as coupon from './blocks/coupon';
import * as lineItems from './blocks/line-items';
import * as button from './blocks/button';
import * as form from './blocks/form';
import * as submit from './blocks/submit';
import * as input from './blocks/input';
import * as divider from './blocks/divider';
import * as checkbox from './blocks/checkbox';
import * as switchBlock from './blocks/switch';

export const BLOCK_PARENTS = [
	'core/columns',
	'checkout-engine/form-row',
	'checkout-engine/form-section',
	'checkout-engine/checkout-form',
];

export const ALLOWED_BLOCKS = [
	'core/spacer',
	'core/columns',
	'checkout-engine/input',
	'checkout-engine/checkbox',
	'checkout-engine/divider',
	'checkout-engine/button',
	'checkout-engine/email',
	'checkout-engine/switch',
	'checkout-engine/form-row',
	'checkout-engine/name',
	'checkout-engine/payment',
	'checkout-engine/pricing-section',
	'checkout-engine/totals',
	'checkout-engine/form-section',
	'checkout-engine/submit',
];

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

	const { metadata, settings } = block;

	registerBlockType(
		{
			...metadata,
			text_domain: 'checkout_engine', // set our textdomain for everything.
		},
		{
			...settings,
			title: metadata.title || settings.title,
		}
	);
};

/**
 * Function to register blocks provided by Checkout Engine.
 */
export const registerCheckoutEngineBlocks = () => {
	[
		checkout,
		section,
		pricingSection,
		totals,
		paymentSection,
		contactSection,
		submit,
		payment,
		coupon,
		lineItems,
		paymentRequest,
		button,
		form,
		input,
		divider,
		switchBlock,
		checkbox,
		total,
		subtotal,
		name,
		email,
	].forEach( registerBlock );
};

registerCheckoutEngineBlocks();
