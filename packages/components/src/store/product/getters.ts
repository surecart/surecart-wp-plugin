import state from './store';
import { state as checkoutState } from '@store/checkout';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position
;
console.log(checkoutState?.product);

export const availableVariantOptions = ( type:'product-page' | 'instant-checkout-page' = 'product-page' ) => ( ('product-page' === type && state?.variant_options ? state.variant_options : 'instant-checkout-page' === type && checkoutState?.product?.variant_options?.data ? checkoutState?.product?.variant_options?.data : state?.variant_options) || [])?.map( ({id, name, values}) => {
   
    return {
        id,
        name,
        values: values?.map((label ) => ({
            label,
            value: label
        }))
    }
    
});
export const availableVariants = ( type:'product-page' | 'instant-checkout-page' = 'product-page' ) => (('product-page' === type && state?.variants ? state.variants : 'instant-checkout-page' === type && checkoutState?.product?.variants?.data ? checkoutState?.product?.variants?.data : state?.variants) || [])

