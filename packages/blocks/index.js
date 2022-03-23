/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

// import './hooks/controls';

// blocks
import * as button from '@blocks/Button';
import * as buyButton from '@blocks/BuyButton';
import * as donation from '@blocks/Donation';
import * as donationAmount from '@blocks/DonationAmount';
import * as card from '@blocks/Card';
import * as address from '@blocks/address';
import * as columns from '@blocks/columns';
import * as column from '@blocks/column';
import * as checkbox from '@blocks/checkbox';
import * as checkout from '@blocks/checkoutForm';
import * as confirmation from '@blocks/Confirmation';
import * as coupon from '@blocks/Coupon';
import * as taxIdInput from '@blocks/TaxIdInput';
import * as customerDashboardButton from '@blocks/CustomerDashboardButton';

// dashboard
import * as customerCharges from '@blocks/dashboard/CustomerCharges';
import * as customerDashboard from '@blocks/dashboard/CustomerDashboard';
import * as customerShippingAddress from '@blocks/dashboard/CustomerShippingAddress';
import * as customerDownloads from '@blocks/dashboard/CustomerDownloads';
import * as customerOrders from '@blocks/dashboard/CustomerOrders';
import * as customerInvoices from '@blocks/dashboard/CustomerInvoices';
import * as customerSubscriptions from '@blocks/dashboard/CustomerSubscriptions';
import * as customerPaymentMethods from '@blocks/dashboard/CustomerPaymentMethods';
import * as customerBillingDetails from '@blocks/dashboard/CustomerBillingDetails';
import * as WordPressAccount from '@blocks/dashboard/WordPressAccount';
import * as dashboardPage from '@blocks/dashboard/DashboardPage';
import * as dashboardPages from '@blocks/dashboard/DashboardPages';
import * as dashboardTab from '@blocks/dashboard/DashboardTab';
import * as dashboardTabs from '@blocks/dashboard/DashboardTabs';

// blocks
import * as divider from '@blocks/divider';
import * as email from '@blocks/email';
import * as expressPayment from '@blocks/ExpressPayment';
import * as form from '@blocks/form';
import * as heading from '@blocks/heading';
import * as input from '@blocks/input';
import * as lineItems from '@blocks/LineItems';
import * as taxLineItem from '@blocks/TaxLineItem';
import * as logoutButton from '@blocks/LogoutButton';
import * as name from '@blocks/name';
import * as confirmationLineItems from '@blocks/OrderConfirmationLineItems';
// import * as confirmationCustomer from '@blocks/OrderConfirmationCustomer';
import * as password from '@blocks/password';
import * as payment from '@blocks/payment';
import * as priceChoice from '@blocks/PriceChoice';
import * as priceSelector from '@blocks/PriceSelector';
// import * as sessionDetail from '@blocks/SessionDetail';
import * as submit from '@blocks/submit';
import * as subtotal from '@blocks/subtotal';
import * as switchBlock from '@blocks/switch';
import * as total from '@blocks/total';
import * as totals from '@blocks/totals';

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
		columns,
		column,
		confirmation,
		donation,
		donationAmount,
		confirmationLineItems,
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
