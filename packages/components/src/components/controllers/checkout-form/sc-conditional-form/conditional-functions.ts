export const is_any_rule_group_passed = ( conditions, props ) => {

  let result = false;

  conditions.forEach( element => {

    if ( result ) {
      return;
    }
    result = is_rules_passed( element['rules'], props );
  });

  return result;
}

export const is_rules_passed = ( rules, props ) => {
  debugger;
  // console.log( 'rules' );
  // console.log( rules );
  const { checkout, processor } = props;
  console.log( checkout );
  let result = true;

  rules.forEach( rule => {

    if ( false === result ) {
      return;
    }
    let ruleOperator = rule['operator'];
		let ruleValue    = rule['value'];

    console.log( "===========" + rule['rule_id'] + "==============" );
    console.log( 'rule' );
    console.log( rule );
    console.log( rule['rule_id'] );
    console.log( rule['condition'] );
    console.log( ruleOperator );
    console.log( ruleValue );
    console.log( "===========" + rule['rule_id'] + "==============" );

    switch (rule['condition']) {
      case 'cart_total':
        result = compare_number_values( parseFloat( checkout.total_amount ), parseFloat( ruleValue ), ruleOperator );
        break;
      case 'cart_item':
        const cart_products = get_cart_products( checkout );
        // console.log( cart_products );
        result = compare_object_values( cart_products, ruleValue, ruleOperator );
        // console.log( result );
        break;
      case 'cart_coupons':
        const cart_coupons = get_cart_coupons( checkout );
        // console.log( cart_coupons );
        result = compare_object_values( cart_coupons, ruleValue, ruleOperator );
        // console.log( result );
        break;
      case 'cart_shipping_country':
        const temp_cart_country = [{ label: 'Temp', value: checkout?.shipping_address?.country }];
        const temp_rule_country = [{ label: 'Temp', value: ruleValue }];
        result = compare_object_values( temp_cart_country, temp_rule_country, ruleOperator );
        break;
      case 'cart_billing_country':
        const temp_cart_bcountry = [{ label: 'Temp', value: checkout?.billing_address?.country }];
        const temp_rule_bcountry = [{ label: 'Temp', value: ruleValue }];
        result = compare_object_values( temp_cart_bcountry, temp_rule_bcountry, ruleOperator );
        break;
      case 'cart_payment_method':
        const temp_cart_processor = [{ value: processor }];
        const temp_rule_processor = [{ value: ruleValue }];
        result = compare_object_values( temp_cart_processor, temp_rule_processor, ruleOperator );
        break;

      default:
        break;
    }
  });

  return result;
}

export const get_cart_products = ( checkout ) => {
  let products = [];

  checkout.line_items.data.forEach(element => {
    products.push(
      {
        label: element.price.product.name,
        value: element.price.product.id,
      }
    );
  });

  return products;
}

export const get_cart_coupons = ( checkout ) => {
  let coupons = [];

  if (checkout?.discount?.coupon) {
    coupons.push(
      {
        label: checkout.discount.coupon.name,
        value: checkout.discount.coupon.id,
      }
    );

  }

  return coupons;
}

/**
 * Compare object values.
 *
 * @param {array} cart_values order values.
 * @param {array} rule_values rules values.
 * @param {string} operator rule operator.
 */

export const compare_object_values = ( cart_values, rule_values, operator ) => {

  let result = false;

  switch ( operator ) {
    case 'all':
        result = rule_values.filter( n1 => cart_values.some( n2 => n1.value == n2.value ) ).length === rule_values.length;
      break;
    case 'any':
        result = cart_values.filter( n1 => rule_values.some( n2 => n1.value == n2.value ) ).length  >= 1;
      break;
    case 'none':
        result = cart_values.filter( n1 => rule_values.some( n2 => n1.value == n2.value ) ).length === 0;
      break;
    case 'exist':
        result = cart_values.length >= 1;
      break;
    case 'not_exist':
        result = cart_values.length === 0;
      break;
    // case '===':
    //     result = count( array_intersect( rule_values, cart_values ) ) === 1;
    //   break;
    // case '!==':
    //     result = count( array_intersect( rule_values, cart_values ) ) === 0;
    //   break;
    default:
        result = false;
      break;
  }

  return result;
}

/**
 * Compare string values.
 *
 * @param string number1 The actual number from cart/order.
 * @param array  number2 Rule values.
 * @param string operator Rule operator.
 */
export const compare_number_values = ( number1, number2, operator ) => {

  let result = false;

  switch ( operator ) {
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
}


export const get_array_values = ( a1, a2, match = true ) => {

  let result = [];

  if( match ) {
    result = a1.filter( n1 => a2.some( n2 => n1.value == n2.value ) );
  } else {
    result = a1.filter( n1 => !a2.some( n2 => n1.value == n2.value ) );
  }

  return result;

};

export const get_formatted_array = ( items ) => {

  let result = items.map( item => item.value );

  return result;
}
