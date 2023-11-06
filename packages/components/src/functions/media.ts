import { FeaturedProductMediaAttributes, Media, Product, ProductMedia } from '../types';

export const sizeImage = (url = '', size, options = 'fit=scale-down,format=auto') => {
  return url.includes('surecart.com') && window.scData?.cdn_root ? `${window.scData?.cdn_root}/${options},width=${size}/${url}` : url;
};

export const getFeaturedProductMediaAttributes = (product: Product):FeaturedProductMediaAttributes => {
  const featuredProductMedia: ProductMedia = product?.featured_product_media as ProductMedia;

  return {
    alt: (featuredProductMedia?.media as Media)?.alt || product?.name,
    url: (featuredProductMedia?.media as Media)?.url || product?.image_url,
    title: (featuredProductMedia?.media as Media)?.title || product?.name,
  };
};
