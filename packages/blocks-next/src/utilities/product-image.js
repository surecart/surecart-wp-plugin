
export const sizeImage = (url = '', size, options = 'fit=scale-down,format=auto') => {
    return url.includes('surecart.com') && window.scData?.cdn_root ? `${window.scData?.cdn_root}/${options},width=${size}/${url}` : url;
};

export const getImageSrc = ( product ) => {
    if ((product?.featured_product_media)?.url) {
        return (product?.featured_product_media)?.url;
    }

    if (((product?.featured_product_media)?.media)?.url) {
        return sizeImage(((product?.featured_product_media)?.media)?.url, applyFilters('surecart/product-list/media/size', 900));
    }

    return `${window.scData?.plugin_url}/images/placeholder.jpg`;
}

export const getFeaturedProductMediaAttributes = (product,selectedVariant) => {
    const featuredProductMedia = product?.featured_product_media;
    const variantMedia = selectedVariant?.image;
    const mediaAttributes = {
        alt: (featuredProductMedia?.media)?.alt || product?.name,
        url: (featuredProductMedia?.media)?.url || product?.image_url,
        title: (featuredProductMedia?.media)?.title || '',
    }

    if (variantMedia?.url) {
        mediaAttributes.url = variantMedia.url;
        mediaAttributes.alt = mediaAttributes.alt || variantMedia.alt;
        mediaAttributes.title = mediaAttributes.title || variantMedia.title;
    }

    return mediaAttributes; 
};