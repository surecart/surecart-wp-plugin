const { registerStore } = wp.data;

import store from './index';

registerStore( 'checkout-engine/ui', store );
