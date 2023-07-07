import state from './store';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position

export const availableVariantOptions = () => (state.variant_options || [])?.sort((a, b) => a?.position - b?.position)?.map( ({id, name, variant_values}) => {
   
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
export const availableVariants = () => (state.variants || [])

