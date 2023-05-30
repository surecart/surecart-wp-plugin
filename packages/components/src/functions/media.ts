export const sizeImage = (url = '', size, options = 'fit=scale-down,format=auto') => {
  return url.includes('surecart.com') && window.scData?.cdn_root ? `${window.scData?.cdn_root}/${options},width=${size}/${url}` : url;
};
