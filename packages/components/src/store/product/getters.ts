import state from './store';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position

export const availableVariantOptions = () => (state.variant_options || [])?.map( ({id, name, values}) => {
   
    return {
        id,
        name,
        values: values?.map((label ) => ({
            label,
            value: label
        }))
    }
    
});
export const availableVariants = () => (state.variants || [])

