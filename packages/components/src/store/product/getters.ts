import state from './store';
import { state as checkoutState } from '@store/checkout';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position
;

export const availableVariantOptions = ( type:'product-page' | 'instant-checkout-page' = 'product-page' ) => ( ('product-page' === type && state?.variant_options ? state.variant_options : 'instant-checkout-page' === type && checkoutState?.product?.variant_options?.data ? checkoutState?.product?.variant_options?.data : state?.variant_options) || [])?.sort((a, b) => a?.position - b?.position)?.map( ({id, name, variant_values}) => {
   
    variant_values?.data?.sort((a, b) => a?.position - b?.position);

    return {
        id,
        name,
        values: variant_values.data.map(({ label, id }) => ({
            label,
            value: id,
        }))
    }
    
});
export const availableVariants = ( type:'product-page' | 'instant-checkout-page' = 'product-page' ) => (('product-page' === type && state?.variants ? state.variants : 'instant-checkout-page' === type && checkoutState?.product?.variants?.data ? checkoutState?.product?.variants?.data : state?.variants) || [])

