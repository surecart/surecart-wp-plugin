import { ArrayOperators, Checkout, NumberOperators, Product, Rule, RuleGroup } from '../../../../types';

/**
 * Check if any of the rule groups is passed or not.
 *
 * @param {array} groups Rule groups.
 * @param {object} props Data.
 * @returns {boolean}
 */
export const hasAnyRuleGroupPassed = (groups: RuleGroup[], props: { checkout: Checkout; processor: string }) => {
  return (groups || []).some(({ rules }) => hasRulesPassed(rules, props));
};

/**
 * CHeck if all rules are passed or not.
 *
 * @param {array} rules Rules.
 * @param {object} props Data.
 * @returns {boolean}
 */
export const hasRulesPassed = (rules: Rule[], { checkout, processor }) => {
  return rules
    .map(rule => {
      const ruleValue = Array.isArray(rule?.value) ? (rule?.value).map(ruleValue => ruleValue?.value || ruleValue) : rule?.value;
      switch (rule?.condition) {
        case 'total':
          return compareNumberValues(parseFloat(checkout.total_amount), parseFloat(ruleValue as string), rule?.operator as NumberOperators);
        case 'products':
          return compareObjectValues(getCartProductIds(checkout), ruleValue as string[], rule?.operator as ArrayOperators);
        case 'coupons':
          return compareObjectValues(getCartCouponIds(checkout), ruleValue as string[], rule?.operator as ArrayOperators);
        case 'shipping_country':
          return compareObjectValues([checkout?.shipping_address?.country], ruleValue as string[], rule?.operator as ArrayOperators);
        case 'billing_country':
          return compareObjectValues([checkout?.billing_address?.country], ruleValue as string[], rule?.operator as ArrayOperators);
        case 'processors':
          return compareObjectValues([processor], ruleValue as string[], rule?.operator as ArrayOperators);
        default:
          return false;
      }
    })
    .every(rules => rules);
};

/**
 * Get array of products from checkout.
 *
 * @param {object} checkout CHeckout data.
 * @returns {array}
 */
export const getCartProductIds = (checkout: Checkout) => {
  return (checkout?.line_items?.data || []).map(({ price }) => (price?.product as Product)?.id);
};

/**
 * Get array of coupons from checkout.
 *
 * @param {object} checkout CHeckout data.
 * @returns {array}
 */
export const getCartCouponIds = (checkout: Checkout) => {
  return checkout?.discount?.coupon?.id ? [checkout?.discount?.coupon?.id] : [];
};

/**
 * Compare object values.
 *
 * @param {array} cart_values order values.
 * @param {array} rule_values rules values.
 * @param {string} operator rule operator.
 * @returns {boolean}
 */

export const compareObjectValues = (cart_values: string[], rule_values: string[], operator: 'all' | 'any' | 'none' | 'exist' | 'not_exist') => {
  switch (operator) {
    case 'all':
      return rule_values.filter(n1 => cart_values.some(n2 => n1 == n2)).length === rule_values.length;
    case 'any':
      return cart_values.filter(n1 => rule_values.some(n2 => n1 == n2)).length >= 1;
    case 'none':
      return cart_values.filter(n1 => rule_values.some(n2 => n1 == n2)).length === 0;
    case 'exist':
      return cart_values.length >= 1;
    case 'not_exist':
      return cart_values.length === 0;
    default:
      return false;
  }
};

/**
 * Compare string values.
 *
 * @param string number1 The actual number from cart/order.
 * @param array  number2 Rule values.
 * @param string operator Rule operator.
 * @returns {boolean}
 */
export const compareNumberValues = (number1: number, number2: number, operator: string) => {
  switch (operator) {
    case '==':
      return number1 === number2;
    case '!=':
      return number1 !== number2;
    case '>':
      return number1 > number2;
    case '<':
      return number1 < number2;
    case '<=':
      return number1 <= number2;
    case '>=':
      return number1 >= number2;
  }

  return false;
};
