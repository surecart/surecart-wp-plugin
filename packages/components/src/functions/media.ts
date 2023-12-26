import { FeaturedProductMediaAttributes, Media, Product, ProductMedia, Variant } from '../types';

export const sizeImage = (url = '', size, options = 'fit=scale-down,format=auto') => {
  return url.includes('surecart.com') && window.scData?.cdn_root ? `${window.scData?.cdn_root}/${options},width=${size}/${url}` : url;
};

export const getFeaturedProductMediaAttributes = (product: Product,selectedVariant?:Variant):FeaturedProductMediaAttributes => {
  const featuredProductMedia: ProductMedia = product?.featured_product_media as ProductMedia;
  const variantMedia: Media = selectedVariant?.image as Media;
  const mediaAttributes: FeaturedProductMediaAttributes = {
    alt: (featuredProductMedia?.media as Media)?.alt || product?.name,
    url: (featuredProductMedia?.media as Media)?.url || product?.image_url,
    title: (featuredProductMedia?.media as Media)?.title || '',
  }

  if (variantMedia?.url) {
    mediaAttributes.url = variantMedia.url;
    mediaAttributes.alt = mediaAttributes.alt || variantMedia.alt;
    mediaAttributes.title = mediaAttributes.title || variantMedia.title;
  }

  return mediaAttributes;
};
