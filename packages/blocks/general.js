/**
 * WordPress dependencies
 */
import { registerBlocks } from './register-block';

import './controls';
import './formats';

import * as checkout from '@blocks/CheckoutForm';
import * as buyButton from '@blocks/BuyButton';
import * as addToCartButton from '@blocks/AddToCartButton';
import * as card from '@blocks/Card';
import * as confirmation from '@blocks/Confirmation';
import * as confirmationLineItems from '@blocks/OrderConfirmationLineItems';
import * as customerDashboardButton from '@blocks/CustomerDashboardButton';
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
import * as conditionalForm from '@blocks/ConditionalForm';

registerBlocks([
	checkout,
	buyButton,
	addToCartButton,
	card,
	confirmation,
	confirmationLineItems,
	customerDashboardButton,
	customerCharges,
	customerDashboard,
	customerShippingAddress,
	customerDownloads,
	customerOrders,
	customerInvoices,
	customerSubscriptions,
	customerPaymentMethods,
	customerBillingDetails,
	WordPressAccount,
	dashboardPage,
	dashboardPages,
	dashboardTab,
	dashboardTabs,
  conditionalForm,
]);
