import { getFormattedPrice } from './currency';

export const getProductDisplayPrice = ( prices, metrics, range = false ) => {
    if ( ! prices ) {
        return '';
    }

    if ( ! range ) {
        const price = ( prices || [] ).sort( ( a, b ) => a?.position - b?.position ).find( price => ! price?.archived );
        return price ? getFormattedPrice( { amount: price?.amount, currency: price?.currency } ) : '';
    }

    if ( ! metrics || ! metrics?.min_price_amount || ! metrics?.max_price_amount ) {
        return '';
    } 
    
    if ( metrics?.min_price_amount === metrics?.max_price_amount ) {
        return getFormattedPrice({amount: metrics?.min_price_amount, currency:metrics?.currency});
    }

    return (
        <>
            {getFormattedPrice({amount: metrics?.min_price_amount, currency:metrics?.currency})} 
            {' - '}
            {getFormattedPrice({amount: metrics?.max_price_amount, currency:metrics?.currency})}
        </>
    );
}