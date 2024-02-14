import { getHumanDiscount } from '../../../../functions/price';
import { Coupon, SubscriptionProtocol } from '../../../../types';
import { __ } from '@wordpress/i18n';

/**
 * Replace the {{ name }} in a string with a new value
 */
export const replaceAmount = (string, replace, name = 'amount') => {
  return string.replaceAll('{{' + name + '}}', replace).replaceAll('{{ ' + name + ' }}', replace);
};

/**
 * Replace the amount in a string with discount.
 */
export const replaceAmountFromString = (amountStr, protocol) =>
  protocol?.preservation_coupon ? replaceAmount(amountStr, getHumanDiscount(protocol?.preservation_coupon as Coupon)) : amountStr;

/**
 *
 */
export const getCurrentBehaviourContent = (protocol: SubscriptionProtocol, hasDiscount) => {
  const { preserve_title, preserve_description, preserve_button, cancel_link } = protocol?.preservation_locales || {};

  if (hasDiscount) {
    const discountLocales = {
      title: replaceAmountFromString(__('Your {{ amount }} discount is still active.', 'surecart'), protocol),
      description: replaceAmountFromString(
        __('You have a {{ amount }} discount active. Cancelling now will forfeit this discount forever. Are you sure you wish to cancel?', 'surecart'),
        protocol,
      ),
      button: __('Keep My Discount', 'surecart'),
      cancel_link: __('Cancel Anyway', 'surecart'),
    };
    return discountLocales;
  }

  const defaultLocales = {
    title: replaceAmountFromString(preserve_title, protocol),
    description: replaceAmountFromString(preserve_description, protocol),
    button: preserve_button,
    cancel_link: cancel_link,
  };
  return defaultLocales;
};
