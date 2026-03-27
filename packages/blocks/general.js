/**
 * WordPress dependencies
 */
import { registerBlocks } from './register-block';

import './controls';
import './formats';

import * as checkout from '@blocks/CheckoutForm';
import * as buyButton from '@blocks/BuyButton';
import * as addToCartButton from '@blocks/AddToCartButton';
import * as cartMenuButton from '@blocks/CartMenuButton';
import * as logoutButton from '@blocks/LogoutButton';
import * as card from '@blocks/Card';
import * as confirmation from '@blocks/Confirmation';
import * as confirmationLineItems from '@blocks/OrderConfirmationLineItems';
import * as customerDashboardButton from '@blocks/CustomerDashboardButton';
import * as customerDashboard from '@blocks/Dashboard/CustomerDashboard';
import * as customerDownloads from '@blocks/Dashboard/CustomerDownloads';
import * as customerOrders from '@blocks/Dashboard/CustomerOrders';
import * as customerInvoices from '@blocks/Dashboard/CustomerInvoices';
import * as customerSubscriptions from '@blocks/Dashboard/CustomerSubscriptions';
import * as customerPaymentMethods from '@blocks/Dashboard/CustomerPaymentMethods';
import * as customerBillingDetails from '@blocks/Dashboard/CustomerBillingDetails';
import * as customerLicenses from '@blocks/Dashboard/CustomerLicenses';
import * as WordPressAccount from '@blocks/Dashboard/WordPressAccount';
import * as dashboardArea from '@blocks/Dashboard/CustomerDashboardArea';
import * as dashboardPage from '@blocks/Dashboard/DashboardPage';
import * as dashboardPages from '@blocks/Dashboard/DashboardPages';
import * as dashboardTab from '@blocks/Dashboard/DashboardTab';
import * as dashboardTabs from '@blocks/Dashboard/DashboardTabs';
import * as storeLogo from '@blocks/StoreLogo';
import * as collectionPage from '@blocks/CollectionPage';

// deprecated
import * as customerCharges from '@blocks/Dashboard/Deprecated/CustomerCharges';
import * as customerShippingAddress from '@blocks/Dashboard/Deprecated/CustomerShippingAddress';

registerBlocks([
	collectionPage,
	cartMenuButton,
	storeLogo,
	buyButton,
	addToCartButton,
	logoutButton,
	checkout,
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
	customerLicenses,
	customerBillingDetails,
	WordPressAccount,
	dashboardArea,
	dashboardPage,
	dashboardPages,
	dashboardTab,
	dashboardTabs,
]);
