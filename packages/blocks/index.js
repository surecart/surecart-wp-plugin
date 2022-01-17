/**
 * WordPress dependencies
 */
import { registerBlockCollection, registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

// blocks
import * as button from '@blocks/Button';
import * as buyButton from '@blocks/BuyButton';
import * as card from '@blocks/Card';
import * as checkbox from '@blocks/checkbox';
import * as checkout from '@blocks/checkoutForm';
import * as confirmation from '@blocks/Confirmation';
import * as coupon from '@blocks/Coupon';
import * as customerDashboardButton from '@blocks/CustomerDashboardButton';

// dashboard
import * as customerCharges from '@blocks/dashboard/CustomerCharges';
import * as customerDashboard from '@blocks/dashboard/CustomerDashboard';
import * as customerOrders from '@blocks/dashboard/CustomerOrders';
import * as customerSubscriptions from '@blocks/dashboard/CustomerSubscriptions';
import * as dashboardPage from '@blocks/dashboard/DashboardPage';
import * as dashboardPages from '@blocks/dashboard/DashboardPages';
import * as dashboardTab from '@blocks/dashboard/DashboardTab';
import * as dashboardTabs from '@blocks/dashboard/DashboardTabs';
import * as divider from '@blocks/divider';
import * as email from '@blocks/email';
import * as expressPayment from '@blocks/ExpressPayment';
import * as form from '@blocks/form';
import * as heading from '@blocks/heading';
import * as input from '@blocks/input';
import * as lineItems from '@blocks/LineItems';
import * as logoutButton from '@blocks/LogoutButton';
import * as name from '@blocks/name';
import * as confirmationLineItems from '@blocks/OrderConfirmationLineItems';
import * as confirmationTotals from '@blocks/OrderConfirmationTotals';
import * as password from '@blocks/password';
import * as payment from '@blocks/payment';
import * as priceChoice from '@blocks/PriceChoice';
import * as priceSelector from '@blocks/PriceSelector';
import * as sessionDetail from '@blocks/SessionDetail';
import * as submit from '@blocks/submit';
import * as subtotal from '@blocks/subtotal';
import * as switchBlock from '@blocks/switch';
import * as total from '@blocks/total';
import * as totals from '@blocks/totals';

// Register block collection
registerBlockCollection('checkout-engine', {
	title: __('Checkout Engine', 'checkout_engine'),
});

const dashboardComponents = [
	customerDashboard,
	dashboardTabs,
	dashboardTab,
	dashboardPages,
	dashboardPage,
	customerSubscriptions,
	customerOrders,
	customerCharges,
];

export const BLOCK_PARENTS = ['core/columns', 'checkout-engine/form'];

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
	'checkout-engine/header',
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
const registerBlock = (block) => {
	if (!block) {
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
		submit,
		card,
		confirmation,
		confirmationLineItems,
		confirmationTotals,
		heading,
		sessionDetail,
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
		logoutButton,
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
		...dashboardComponents,
	].forEach(registerBlock);
};

registerCheckoutEngineBlocks();
