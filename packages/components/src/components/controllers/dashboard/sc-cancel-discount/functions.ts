import { getHumanDiscount } from '../../../../functions/price';
import { Coupon } from '../../../../types';
import { __ } from '@wordpress/i18n';

export const replaceAmount = (string, replace, name = 'amount') => {
  return string.replaceAll('{{' + name + '}}', replace).replaceAll('{{ ' + name + ' }}', replace);
};

const replaceAmountFromString = (string, protocol) => {
  if (!protocol?.preservation_coupon) {
    return string;
  }
  return replaceAmount(string, getHumanDiscount(protocol?.preservation_coupon as Coupon));
}

export const getCurrentBehaviourTitle = (subscription, protocol, type) => {
  const { preserve_title, preserve_description, preserve_button, cancel_link } = protocol?.preservation_locales || {};

  if (subscription?.discount?.id) {
    const discountLocales = {
      title: replaceAmountFromString(__('Your {{ amount }} Discount is Active!', 'surecart'), protocol),
      description: replaceAmountFromString(__('Remember, you have a {{ amount }} discount on your next payment. If there is anything we can do to enhance your experience, just let us know!', 'surecart'), protocol),
      button: __('Keep My Discount & Stay', 'surecart'),
      cancel_link: __('Proceed with Cancellation', 'surecart'),
    };
    return discountLocales[type];
  }

  const defaultLocales = {
    title: replaceAmountFromString(preserve_title, protocol),
    description: replaceAmountFromString(preserve_description, protocol),
    button: preserve_button,
    cancel_link: cancel_link,
  };
  return defaultLocales[type];
}; 
