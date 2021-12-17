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
import * as email from './blocks/email';
import * as total from './blocks/total';
import * as subtotal from './blocks/subtotal';
import * as priceSelector from './blocks/price-selector';
import * as priceChoice from './blocks/price-choice';
import * as title from './blocks/section-title';
import * as totals from './blocks/totals';
import * as name from './blocks/name';
import * as payment from './blocks/payment';
import * as heading from './blocks/heading';
import * as sessionDetail from './blocks/session-detail';
import * as sessionSubscription from './blocks/session-subscription';
import * as expressPayment from './blocks/express-payment';
import * as confirmation from './blocks/confirmation';
import * as confirmationLineItems from './blocks/order-confirmation-line-items';
import * as confirmationTotals from './blocks/order-confirmation-totals';
import * as customerDashboardButton from './blocks/customer-dashboard-button';
import * as coupon from './blocks/coupon';
import * as lineItems from './blocks/line-items';
import * as button from './blocks/button';
import * as form from './blocks/form';
import * as buyButton from './blocks/buy-button';
import * as submit from './blocks/submit';
import * as card from './blocks/card';
import * as input from './blocks/input';
import * as password from './blocks/password';
import * as divider from './blocks/divider';
import * as checkbox from './blocks/checkbox';
import * as switchBlock from './blocks/switch';

// dashboard
import * as customerDashboard from './blocks/dashboard/customer-dashboard';
import * as dashboardTabs from './blocks/dashboard/dashboard-tabs';
import * as dashboardTab from './blocks/dashboard/dashboard-tab';
import * as dashboardPages from './blocks/dashboard/dashboard-pages';
import * as dashboardPage from './blocks/dashboard/dashboard-page';

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
	'checkout-engine/express-payment',
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
		totals,
		title,
		submit,
		card,
		confirmation,
		confirmationLineItems,
		confirmationTotals,
		heading,
		sessionDetail,
		sessionSubscription,
		payment,
		expressPayment,
		priceSelector,
		priceChoice,
		coupon,
		lineItems,
		button,
		buyButton,
		customerDashboard,
		customerDashboardButton,
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
		dashboardTabs,
		dashboardTab,
		dashboardPages,
		dashboardPage,
	].forEach( registerBlock );
};

registerCheckoutEngineBlocks();
