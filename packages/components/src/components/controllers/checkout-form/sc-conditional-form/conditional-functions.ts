
export const is_any_rule_group_passed = ( conditions, checkout ) => {

  let result = false;

  conditions.forEach( element => {
    // debugger;
    // console.log( 'element' );
    // console.log( element['rules'] );
    // console.log( checkout );

    if ( result ) {
      return;
    }
    result = is_rules_passed( element['rules'], checkout );
  });

  return result;
}

export const is_rules_passed = ( rules, checkout ) => {
  debugger;
  // console.log( 'rules' );
  // console.log( rules );
  console.log( checkout );
  let result = true;

  rules.forEach( rule => {
    // debugger;
    console.log( 'rule' );
    console.log( rule );

    if ( false === result ) {
      return;
    }
    let ruleOperator = rule['operator'];
		let ruleValue    = rule['value'];

    switch (rule['condition']) {
      case 'cart_total':
        console.log( parseFloat( checkout.total_amount ) );
        console.log( parseFloat( ruleValue ) );

        result = compare_number_values( parseFloat( checkout.total_amount ), parseFloat( ruleValue ), ruleOperator );
        break;

      default:
        break;
    }
    // result = is_rules_passed( element['rules'], checkout );
  });

  return result;
}

/**
 * Compare string values.
 *
 * @param {array} cart_values order values.
 * @param {array} rule_values rules values.
 * @param {string} operator rule operator.
 */

export const compare_string_values = ( cart_values, rule_values, operator ) => {

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
