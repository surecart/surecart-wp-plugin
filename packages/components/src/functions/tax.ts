import { __ } from '@wordpress/i18n';
export const zones = {
  ca_gst: {
    label: __('GST Number', 'checkout-engine'),
    label_small: __('CA GST', 'checkout_engine'),
  },
  au_abn: {
    label: __('ABN Number', 'checkout-engine'),
    label_small: __('AU ABN', 'checkout_engine'),
  },
  gb_vat: {
    label: __('VAT Number', 'checkout_engine'),
    label_small: __('UK VAT', 'checkout_engine'),
  },
  eu_vat: {
    label: __('VAT Number', 'checkout_engine'),
    label_small: __('EU VAT', 'checkout_engine'),
  },
  other: {
    label: __('Tax ID', 'checkout-engine'),
    label_small: __('Other', 'checkout_engine'),
  },
};

export const getType = key => {
  if (key === 'CA') {
    return 'ca_gst';
  }
  if (key === 'AU') {
    return 'au_abn';
  }
  if (key === 'GB') {
    return 'gb_vat';
  }
  if (['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'EL', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'RO', 'SK', 'SI', 'ES', 'SE'].includes(key)) {
    return 'eu_vat';
  }
  return null;
};
