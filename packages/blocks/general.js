/**
 * WordPress dependencies
 */

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
import * as customerSubscriptions from '@blocks/Dashboard/CustomerSubscriptions';
import * as customerPaymentMethods from '@blocks/Dashboard/CustomerPaymentMethods';
import * as customerBillingDetails from '@blocks/Dashboard/CustomerBillingDetails';
import * as WordPressAccount from '@blocks/Dashboard/WordPressAccount';
import * as dashboardArea from '@blocks/Dashboard/CustomerDashboardArea';
import * as dashboardPage from '@blocks/Dashboard/DashboardPage';
import * as dashboardPages from '@blocks/Dashboard/DashboardPages';
import * as dashboardTab from '@blocks/Dashboard/DashboardTab';
import * as dashboardTabs from '@blocks/Dashboard/DashboardTabs';
import * as storeLogo from '@blocks/StoreLogo';

// deprecated
import * as customerCharges from '@blocks/Dashboard/Deprecated/CustomerCharges';
import * as customerInvoices from '@blocks/Dashboard/Deprecated/CustomerInvoices';
import * as customerShippingAddress from '@blocks/Dashboard/Deprecated/CustomerShippingAddress';
import { registerBlocksForTemplates } from './conditional-block-registration';

// unregister these blocks on product page templates.
// @todo Refactor when there will be possible to show a block according on a template/post with a Gutenberg API. https://github.com/WordPress/gutenberg/pull/41718
registerBlocksForTemplates({
	blocks: [
		checkout,
		buyButton,
		addToCartButton,
		cartMenuButton,
		logoutButton,
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
		dashboardArea,
		dashboardPage,
		dashboardPages,
		dashboardTab,
		dashboardTabs,
		storeLogo,
	],
	// exclude for these templates.
	exclude: [
		'surecart/surecart//product-info',
		'surecart/surecart//single-product',
		'surecart/surecart//product-collection-part',
		'surecart/surecart//product-collection',
		'sc-products',
		'sc-part-products-info',
		'sc-product-collection',
		'sc-part-product-collection',
	],
});
