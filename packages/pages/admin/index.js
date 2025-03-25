import { registerPlugin } from '@wordpress/plugins';

import ProductPageBackButton from './ProductPageBackButton';
import ProductPageInfo from './ProductPageInfo';
import CustomerDashboard from './CustomerDashboard';

/** Customer Dashboard Navigation Controls */
registerPlugin('customer-dashboard', {
	render: CustomerDashboard,
});

/** Product Page Back Button */
registerPlugin('product-page-back-button', {
	render: ProductPageBackButton,
});

/** Product Page Info */
// registerPlugin('product-page-info', {
// 	render: ProductPageInfo,
// });
