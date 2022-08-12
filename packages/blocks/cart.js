import { registerBlocks } from './register-block';

import * as cart from '@blocks/Cart';
import * as cartItems from '@blocks/CartItems';
import * as cartCoupon from '@blocks/CartCoupon';
import * as cartSubtotal from '@blocks/CartSubtotal';
import * as cartMessage from '@blocks/CartMessage';
import * as cartHeader from '@blocks/CartHeader';
import * as cartSubmit from '@blocks/CartSubmit';

registerBlocks([
	cart,
	cartItems,
	cartCoupon,
	cartSubtotal,
	cartMessage,
	cartHeader,
	cartSubmit,
]);
