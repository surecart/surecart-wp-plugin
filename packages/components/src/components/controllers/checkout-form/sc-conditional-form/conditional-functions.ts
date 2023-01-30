/**
 * Check if any of the rule groups is passed or not.
 *
 * @param {array} groups Rule groups.
 * @param {object} props Data.
 * @returns {boolean}
 */
export const is_any_rule_group_passed = (groups, props) => {
  let result = false;

  if (Array.isArray(groups)) {
    groups.forEach(element => {
      if (result) {
        return;
      }
      result = is_rules_passed(element['rules'], props);
    });
  }

  return result;
};

/**
 * CHeck if all rules are passed or not.
 *
 * @param {array} rules Rules.
 * @param {object} props Data.
 * @returns {boolean}
 */
export const is_rules_passed = (rules, props) => {
  const { checkout, processor } = props;

  let result = true;

  rules.forEach(rule => {
    if (false === result) {
      return;
    }
    const ruleOperator = rule['operator'];
    const ruleValue = rule?.['value'] || rule;

    switch (rule['condition']) {
      case 'total':
        result = compare_number_values(parseFloat(checkout.total_amount), parseFloat(ruleValue), ruleOperator);
        break;
      case 'products':
        const cart_products = get_cart_products(checkout);
        result = compare_object_values(cart_products, ruleValue, ruleOperator);
        break;
      case 'coupons':
        const cart_coupons = get_cart_coupons(checkout);
        result = compare_object_values(cart_coupons, ruleValue, ruleOperator);
        break;
      case 'shipping_country':
        const temp_cart_scountry = [{ value: checkout?.shipping_address?.country }];
        result = compare_object_values(temp_cart_scountry, ruleValue, ruleOperator);
        break;
      case 'billing_country':
        const temp_cart_bcountry = [{ value: checkout?.billing_address?.country }];
        result = compare_object_values(temp_cart_bcountry, ruleValue, ruleOperator);
        break;
      case 'payment_methods':
        const temp_cart_processor = [{ value: processor }];
        result = compare_object_values(temp_cart_processor, ruleValue, ruleOperator);
        break;
    }
  });

  return result;
};

/**
 * Get array of products from checkout.
 *
 * @param {object} checkout CHeckout data.
 * @returns {array}
 */
export const get_cart_products = checkout => {
  let products = [];

  checkout.line_items.data.forEach(element => {
    products.push({
      label: element.price.product.name,
      value: element.price.product.id,
    });
  });

  return products;
};

/**
 * Get array of coupons from checkout.
 *
 * @param {object} checkout CHeckout data.
 * @returns {array}
 */
export const get_cart_coupons = checkout => {
  let coupons = [];

  if (checkout?.discount?.coupon) {
    coupons.push({
      label: checkout.discount.coupon.name,
      value: checkout.discount.coupon.id,
    });
  }

  return coupons;
};

/**
 * Compare object values.
 *
 * @param {array} cart_values order values.
 * @param {array} rule_values rules values.
 * @param {string} operator rule operator.
 * @returns {boolean}
 */

export const compare_object_values = (cart_values, rule_values, operator) => {
  let result = false;

  switch (operator) {
    case 'all':
      result = rule_values.filter(n1 => cart_values.some(n2 => n1.value == n2.value)).length === rule_values.length;
      break;
    case 'any':
      result = cart_values.filter(n1 => rule_values.some(n2 => n1.value == n2.value)).length >= 1;
      break;
    case 'none':
      result = cart_values.filter(n1 => rule_values.some(n2 => n1.value == n2.value)).length === 0;
      break;
    case 'exist':
      result = cart_values.length >= 1;
      break;
    case 'not_exist':
      result = cart_values.length === 0;
      break;
    default:
      result = false;
      break;
  }

  return result;
};

/**
 * Compare string values.
 *
 * @param string number1 The actual number from cart/order.
 * @param array  number2 Rule values.
 * @param string operator Rule operator.
 * @returns {boolean}
 */
export const compare_number_values = (number1, number2, operator) => {
  let result = false;

  switch (operator) {
    case '==':
      result = number1 === number2;
      break;
    case '!=':
      result = number1 !== number2;
      break;
    case '>':
      result = number1 > number2;
      break;
    case '<':
      result = number1 < number2;
      break;
    case '<=':
      result = number1 <= number2;
      break;
    case '>=':
      result = number1 >= number2;
      break;
    default:
      result = false;
      break;
  }

  return result;
};
