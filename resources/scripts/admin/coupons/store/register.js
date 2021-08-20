const { registerStore } = wp.data;
import {
	STORE_KEY as COUPON_STORE_KEY,
	STORE_CONFIG as couponConfig,
} from './index';
registerStore( COUPON_STORE_KEY, couponConfig );
