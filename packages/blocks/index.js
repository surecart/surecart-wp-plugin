/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import './controls';
import './formats';

// blocks
import * as button from '@blocks/Button';
import * as buyButton from '@blocks/BuyButton';
import * as addToCartButton from '@blocks/AddToCartButton';
import * as donation from '@blocks/Donation';
import * as donationAmount from '@blocks/DonationAmount';
import * as nameYourPrice from '@blocks/NameYourPrice';
import * as card from '@blocks/Card';
import * as address from '@blocks/Address';
import * as columns from '@blocks/Columns';
import * as column from '@blocks/Column';
import * as checkbox from '@blocks/Checkbox';
import * as checkout from '@blocks/CheckoutForm';
import * as confirmation from '@blocks/Confirmation';
import * as coupon from '@blocks/Coupon';
import * as taxIdInput from '@blocks/TaxIdInput';
import * as customerDashboardButton from '@blocks/CustomerDashboardButton';

// dashboard
import * as customerCharges from '@blocks/Dashboard/CustomerCharges';
import * as customerDashboard from '@blocks/Dashboard/CustomerDashboard';
import * as customerShippingAddress from '@blocks/Dashboard/CustomerShippingAddress';
import * as customerDownloads from '@blocks/Dashboard/CustomerDownloads';
import * as customerOrders from '@blocks/Dashboard/CustomerOrders';
import * as customerInvoices from '@blocks/Dashboard/CustomerInvoices';
import * as customerSubscriptions from '@blocks/Dashboard/CustomerSubscriptions';
import * as customerPaymentMethods from '@blocks/Dashboard/CustomerPaymentMethods';
import * as customerBillingDetails from '@blocks/Dashboard/CustomerBillingDetails';
import * as WordPressAccount from '@blocks/Dashboard/WordPressAccount';
import * as dashboardPage from '@blocks/Dashboard/DashboardPage';
import * as dashboardPages from '@blocks/Dashboard/DashboardPages';
import * as dashboardTab from '@blocks/Dashboard/DashboardTab';
import * as dashboardTabs from '@blocks/Dashboard/DashboardTabs';

// blocks
import * as divider from '@blocks/Divider';
import * as email from '@blocks/Email';
import * as expressPayment from '@blocks/ExpressPayment';
import * as form from '@blocks/Form';
import * as heading from '@blocks/Heading';
import * as input from '@blocks/Input';
import * as lineItems from '@blocks/LineItems';
import * as taxLineItem from '@blocks/TaxLineItem';
import * as logoutButton from '@blocks/LogoutButton';
import * as name from '@blocks/Name';
import * as confirmationLineItems from '@blocks/OrderConfirmationLineItems';
import * as password from '@blocks/Password';
import * as payment from '@blocks/Payment';
import * as priceChoice from '@blocks/PriceChoice';
import * as priceSelector from '@blocks/PriceSelector';
import * as submit from '@blocks/Submit';
import * as subtotal from '@blocks/Subtotal';
import * as switchBlock from '@blocks/Switch';
import * as total from '@blocks/Total';
import * as totals from '@blocks/Totals';
import { registerBlocks } from './register-block';

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

registerBlocks([
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
	nameYourPrice,
	heading,
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
]);
