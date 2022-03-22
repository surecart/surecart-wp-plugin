import { resetLocaleData } from '@wordpress/i18n';

if (window?.wp?.i18n) {
  const data = window?.wp?.i18n.getLocaleData('surecart');
  resetLocaleData(data, 'surecart');
}
