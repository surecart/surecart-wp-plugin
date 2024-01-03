import { state } from './store';

export const redirectUpsell = () => {
    // Get current upsell.
    const { upsell, checkout } = state;

    // Check if there is more upsell or not for this checkout.
    console.log('upsell', upsell);

    // If there is more upsell, redirect to the next upsell.
    console.log('checkout', checkout);

    // If there is no more upsell to traverse, redirect to the checkout success page.
    // const successUrl = upsellLineItemAdded?.success_url || window?.scData?.pages?.checkout;
    // window.location.href = successUrl;
};
