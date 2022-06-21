import { resetLocaleData } from '@wordpress/i18n';
import registerIcons from '../components/ui/icon/register';
registerIcons();

if (window?.wp?.i18n) {
  const data = window?.wp?.i18n.getLocaleData('surecart');
  resetLocaleData(data, 'surecart');
}

export { registerIcons };
