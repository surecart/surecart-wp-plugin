/**
 * Internal dependencies.
 */
import { onChange as onChangeProduct, state as productState } from '../product';
// import { state as checkoutState } from '../checkout';
import state from './store';

const maybeUpdateCheckoutLineItems = () => {
    const productQty = productState?.[state.product?.id]?.quantity;
    console.log('Qty', productQty);

    // Update checkout line items.
}

onChangeProduct(state.product?.id, () => {
    maybeUpdateCheckoutLineItems();
});