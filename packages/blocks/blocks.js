/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType, registerBlockCollection } from '@wordpress/blocks';

// Register block collection
registerBlockCollection( 'checkout-engine', {
	title: __( 'Checkout Engine', 'checkout_engine' ),
} );

// blocks
import * as checkout from './blocks/checkout';
import * as section from './blocks/section';
import * as email from './blocks/email';
import * as total from './blocks/total';
import * as subtotal from './blocks/subtotal';
import * as priceSelector from './blocks/price-selector';
import * as priceChoice from './blocks/price-choice';
import * as title from './blocks/section-title';
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
import * as password from './blocks/password';
import * as divider from './blocks/divider';
import * as checkbox from './blocks/checkbox';
import * as switchBlock from './blocks/switch';

export const BLOCK_PARENTS = [ 'core/columns', 'checkout-engine/form' ];

export const ALLOWED_BLOCKS = [
	'core/spacer',
	'core/columns',
	'checkout-engine/input',
	'checkout-engine/password',
	'checkout-engine/price-selector',
	'checkout-engine/checkbox',
	'checkout-engine/divider',
	'checkout-engine/button',
	'checkout-engine/email',
	'checkout-engine/switch',
	'checkout-engine/name',
	'checkout-engine/payment',
	'checkout-engine/payment-request',
	'checkout-engine/pricing-section',
	'checkout-engine/totals',
	'checkout-engine/form',
	'checkout-engine/section-title',
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
			parent: BLOCK_PARENTS,
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
		totals,
		title,
		submit,
		payment,
		paymentRequest,
		priceSelector,
		priceChoice,
		coupon,
		lineItems,
		button,
		form,
		input,
		password,
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
