import { __ } from '@wordpress/i18n';
export const zones = {
  ca_gst: {
    label: __('GST Number', 'checkout-engine'),
    label_small: __('CA GST', 'surecart'),
  },
  au_abn: {
    label: __('ABN Number', 'checkout-engine'),
    label_small: __('AU ABN', 'surecart'),
  },
  gb_vat: {
    label: __('VAT Number', 'surecart'),
    label_small: __('UK VAT', 'surecart'),
  },
  eu_vat: {
    label: __('VAT Number', 'surecart'),
    label_small: __('EU VAT', 'surecart'),
  },
  other: {
    label: __('Tax ID', 'checkout-engine'),
    label_small: __('Other', 'surecart'),
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
