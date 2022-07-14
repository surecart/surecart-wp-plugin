/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import './controls';
import './formats';

// cart
import * as cart from './Blocks/Cart';
import * as cartItems from './Blocks/CartItems';
import * as cartCoupon from './Blocks/CartCoupon';
import * as cartSubtotal from './Blocks/CartSubtotal';
import * as cartMessage from './Blocks/CartMessage';
import * as cartHeader from './Blocks/CartHeader';
import * as cartSubmit from './Blocks/CartSubmit';

// blocks
import * as button from './Blocks/Button';
import * as buyButton from './Blocks/BuyButton';
import * as addToCartButton from './Blocks/AddToCartButton';
import * as donation from './Blocks/Donation';
import * as donationAmount from './Blocks/DonationAmount';
import * as nameYourPrice from './Blocks/NameYourPrice';
import * as card from './Blocks/Card';
import * as address from './Blocks/address';
import * as columns from './Blocks/columns';
import * as column from './Blocks/column';
import * as checkbox from './Blocks/checkbox';
import * as checkout from './Blocks/checkoutForm';
import * as confirmation from './Blocks/Confirmation';
import * as coupon from './Blocks/Coupon';
import * as taxIdInput from './Blocks/TaxIdInput';
import * as customerDashboardButton from './Blocks/CustomerDashboardButton';

// dashboard
import * as customerCharges from './Blocks/dashboard/CustomerCharges';
import * as customerDashboard from './Blocks/dashboard/CustomerDashboard';
import * as customerShippingAddress from './Blocks/dashboard/CustomerShippingAddress';
import * as customerDownloads from './Blocks/dashboard/CustomerDownloads';
import * as customerOrders from './Blocks/dashboard/CustomerOrders';
import * as customerInvoices from './Blocks/dashboard/CustomerInvoices';
import * as customerSubscriptions from './Blocks/dashboard/CustomerSubscriptions';
import * as customerPaymentMethods from './Blocks/dashboard/CustomerPaymentMethods';
import * as customerBillingDetails from './Blocks/dashboard/CustomerBillingDetails';
import * as WordPressAccount from './Blocks/dashboard/WordPressAccount';
import * as dashboardPage from './Blocks/dashboard/DashboardPage';
import * as dashboardPages from './Blocks/dashboard/DashboardPages';
import * as dashboardTab from './Blocks/dashboard/DashboardTab';
import * as dashboardTabs from './Blocks/dashboard/DashboardTabs';

// blocks
import * as divider from './Blocks/divider';
import * as email from './Blocks/email';
import * as expressPayment from './Blocks/ExpressPayment';
import * as form from './Blocks/form';
import * as heading from './Blocks/heading';
import * as input from './Blocks/input';
import * as lineItems from './Blocks/LineItems';
import * as taxLineItem from './Blocks/TaxLineItem';
import * as logoutButton from './Blocks/LogoutButton';
import * as name from './Blocks/name';
import * as confirmationLineItems from './Blocks/OrderConfirmationLineItems';
// import * as confirmationCustomer from './Blocks/OrderConfirmationCustomer';
import * as password from './Blocks/password';
import * as payment from './Blocks/payment';
import * as priceChoice from './Blocks/PriceChoice';
import * as priceSelector from './Blocks/PriceSelector';
// import * as sessionDetail from './Blocks/SessionDetail';
import * as submit from './Blocks/submit';
import * as subtotal from './Blocks/subtotal';
import * as switchBlock from './Blocks/switch';
import * as total from './Blocks/total';
import * as totals from './Blocks/totals';

const dashboardComponents = [
	customerDashboard,
	dashboardTabs,
	dashboardTab,
	dashboardPages,
	WordPressAccount,
	customerShippingAddress,
	dashboardPage,
	customerSubscriptions,
	customerBillingDetails,
	customerPaymentMethods,
	customerOrders,
	customerDownloads,
	customerInvoices,
	customerCharges,
];

export const BLOCK_PARENTS = ['surecart/columns', 'surecart/form'];

export const ALLOWED_BLOCKS = [
	'core/spacer',
	'core/columns',
	'surecart/input',
	'surecart/password',
	'surecart/price-selector',
	'surecart/checkbox',
	'surecart/divider',
	'surecart/button',
	'surecart/email',
	'surecart/header',
	'surecart/switch',
	'surecart/name',
	'surecart/payment',
	'surecart/express-payment',
	'surecart/pricing-section',
	'surecart/totals',
	'surecart/form',
	'surecart/section-title',
	'surecart/submit',
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
			text_domain: 'surecart', // set our textdomain for everything.
		},
		{
			...settings,
			title: metadata.title || settings.title,
		}
	);
};

/**
 * Function to register blocks provided by SureCart.
 */
export const registerSureCartBlocks = () => {
	[
		address,
		checkout,
		totals,
		submit,
		card,
		cart,
		cartCoupon,
		cartItems,
		cartSubmit,
		cartMessage,
		cartHeader,
		cartSubtotal,
		columns,
		column,
		confirmation,
		donation,
		donationAmount,
		confirmationLineItems,
		nameYourPrice,
		// confirmationCustomer,
		heading,
		// sessionDetail,
		payment,
		expressPayment,
		priceSelector,
		priceChoice,
		coupon,
		lineItems,
		taxLineItem,
		button,
		buyButton,
		addToCartButton,
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
		taxIdInput,
		...dashboardComponents,
	].forEach(registerBlock);
};

registerSureCartBlocks();
