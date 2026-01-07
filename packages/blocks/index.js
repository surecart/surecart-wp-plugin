import { defineCustomElements } from '@surecart/components/loader';
defineCustomElements();

if (window?.registerSureCartIconPath) {
	window.registerSureCartIconPath(
		window?.scData?.plugin_url + '/dist/icon-assets'
	);
}

import '../admin/store/add-entities';
import './general';
import './cart';
import './checkout';
import './products';
import './upsell';
