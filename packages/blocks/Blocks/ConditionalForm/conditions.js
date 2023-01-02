/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

import SelectProducts from './selectProducts';
import SelectCoupons from './selectCoupons';
import { countryChoices } from '@surecart/components';


function Conditions( props ) {

  const { rules, group_id, g_index, groups_length, removeConditionFromRuleGroup, updateConditionInRuleGroup, updateConditionOptionInRuleGroup } = props;

  const conditions_select = [
    { label: __( 'Product(s)', 'surecart' ), value: 'cart_item' },
    { label: __( 'Total', 'surecart' ), value: 'cart_total' },
    { label: __( 'Coupon(s)', 'surecart' ), value: 'cart_coupons' },
    { label: __( 'Payment Processor', 'surecart' ), value: 'cart_payment_method' },
    { label: __( 'Billing country', 'surecart' ), value: 'cart_billing_country' },
    { label: __( 'Shipping country', 'surecart' ), value: 'cart_shipping_country' }
  ];
  const stringOperators = [
    {
        'label': __( 'matches any of', 'surecart' ),
        'value': 'any'
    },
    {
        'label': __( 'matches all of', 'surecart' ),
        'value': 'all'
    },
    {
        'label': __( 'matches none of', 'surecart' ),
        'value': 'none'
    }
  ];
  const mathOperators = [
    {
        'label': __( 'is equal to', 'surecart' ),
        'value': '=='
    },
    {
        'label': __( 'is not equal to', 'surecart' ),
        'value': '!='
    },
    {
        'label': __( 'is greater than', 'surecart' ),
        'value': '>'
    },
    {
        'label': __( 'is less than', 'surecart' ),
        'value': '<'
    },
    {
        'label': __( 'is greater or equal to', 'surecart' ),
        'value': '>='
    },
    {
        'label': __( 'is less or equal to', 'surecart' ),
        'value': '<='
    }
  ];
  const couponOperators = [
    {
      'label': __( 'matches any of', 'surecart' ),
      'value': 'any',
    },
    {
      'label': __( 'matches all of', 'surecart' ),
      'value': 'all',
    },
    {
      'label': __( 'matches none of', 'surecart' ),
      'value': 'none',
    },
    {
      'label': __( 'exist', 'surecart' ),
      'value': 'exist',
    },
    {
      'label': __( 'not exist', 'surecart' ),
      'value': 'not_exist',
    },
  ];
  const shippingOperators = [
    {
      'label': __( 'matches any of', 'surecart' ),
      'value': 'any',
    },
    {
      'label': __( 'matches none of', 'surecart' ),
      'value': 'none',
    },
  ];
  const rule_settings_field_data = {
    'cart_item': {
        'operator': stringOperators,
        'fields': [
            {
                'type': 'products',
                'placeholder': __( 'Search for products..', 'surecart' ),
                'isMulti': true
            }
        ]
    },
    'cart_total': {
        'operator': mathOperators,
        'fields': [
            {
                'type': 'number'
            }
        ]
    },
    'cart_coupons': {
      'operator': couponOperators,
      'fields': [
        {
          'type': 'coupons',
          'placeholder': __( 'Search for coupons..', 'surecart' ),
          'isMulti': true,
        },
      ],
    },
    'cart_billing_country': {
      'operator': shippingOperators,
      'fields': [
        {
          'type': 'select',
          'placeholder': __( 'Search for country..', 'surecart' ),
          'isMulti': true,
          'options': countryChoices
        },
      ],
    },
    'cart_shipping_country': {
      'operator': shippingOperators,
      'fields': [
        {
          'type': 'select',
          'placeholder': __( 'Search for country..', 'surecart' ),
          'isMulti': true,
          'options': countryChoices
        },
      ],
    },
    'cart_payment_method': {
      'operator': shippingOperators,
      'fields': [
        {
          'type': 'select',
          'placeholder': __( 'Search for payment method..', 'surecart' ),
          'isMulti': true,
          'options': [
            { 'label': 'Stripe', 'value': 'stripe' },
            { 'label': 'PayPal', 'value': 'paypal' }
          ],
        },
      ],
    },
  };


	const removeCondition = ( event, rule_id, rule_index ) => {
    // debugger
		// const rule_id = event.target.getAttribute( 'rule_id' );

		if ( group_id && rule_id ) {
      removeConditionFromRuleGroup( group_id, rule_id, rule_index );
		}
	};

	const valueFields = function ( fields, r_index, rule_data ) {
    // debugger;
		const value = rule_data.value;
    const rule_id = rule_data.rule_id;

		let rendorfields = '';
		const name = `sc-form-rules[${ g_index }][rules][${ r_index }][value]`;

		return fields.map( ( field ) => {
      // debugger;
			switch ( field.type ) {
				case 'products':
          // debugger
					rendorfields = (
            <SelectProducts
							name={ `${ name }[]` }
							value={ value }
							placeholder={ field.placeholder }
							tooltip={ field.tooltip }
							options={ field.options }
							isMulti={ field.isMulti }
              onChangeCB={ ( selection ) => { updateConditionOptionInRuleGroup( group_id, rule_id, selection, 'value' ); } }
						/>
					);
					break;

        case 'coupons':
          // debugger
          if (
						'exist' === rule_data.operator ||
						'not_exist' === rule_data.operator
					) {
						// If required we will add field here for these two option
					} else {
            rendorfields = (
              <SelectCoupons
                name={ `${ name }[]` }
                value={ value }
                placeholder={ field.placeholder }
                tooltip={ field.tooltip }
                options={ field.options }
                isMulti={ field.isMulti }
                onChangeCB={ ( selection ) => { updateConditionOptionInRuleGroup( group_id, rule_id, selection, 'value' ); } }
              />
            );
          }
					break;
        case 'select':
					rendorfields = (
						<SelectControl
							name={ `${ name }[]` }
							value={ value }
							placeholder={ field.placeholder }
							tooltip={ field.tooltip }
							options={ field.options }
							isMulti={ field.isMulti }
              onChange={ ( selection ) => { updateConditionOptionInRuleGroup( group_id, rule_id, selection, 'value' ); } }
						/>
					);
					break;

				case 'number':
          rendorfields = (
						<NumberControl
              name={ name }
              value={ value }
              placeholder={ field.placeholder }
				      tooltip={ field.tooltip }
              onChange={ ( selection ) => { updateConditionOptionInRuleGroup( group_id, rule_id, selection, 'value' ); } }
              isShiftStepEnabled={ true }
              shiftStep={ 1 }
            />
					);
					break;

        case 'text':
					rendorfields = (
						<TextControl
							name={ name }
							value={ value }
							placeholder={ field.placeholder }
							tooltip={ field.tooltip }
              onChange={ ( selection ) => { updateConditionOptionInRuleGroup( group_id, rule_id, selection, 'value' ); } }
						/>
					);
					break;
        default:
			}
			return rendorfields;
		} );
	};

	const removeConditionIcon = function ( rules_length, rule_index, rule_id ) {
		if ( 1 === rules_length && 1 === groups_length ) {
			return '';
		}
		return (
      <div className='button' css={css`margin-top:15px;`}
        onClick={ (e) => { removeCondition(e, rule_id, rule_index ); } }
        group_id={ group_id }
        rule_id={ rule_id }
      >{
        __( 'Remove Condition', 'surecart' )
      }</div>
		);
	};

  return (
		<Fragment>
			{ rules.map( ( rule, r_index ) => {
        // debugger;
				const rule_id = rule?.rule_id;
				const rule_data = rules[ r_index ];
				const rule_field_data = rule_settings_field_data[ rule_data.condition ];

				return (
					<>
						{ 0 !== r_index && (
							<div className="sc-rules--group_rules__condition-label">
								<div className="sc--condition-label__and_group" css={css`
                  padding: 4px 6px;
                  border: 1px solid #d4d4d4;
                  margin: 15px auto;
                  width: 48px;
                  text-align: center;
                `}>
									<span className="sc--condition-label__and_group__text">
										{ __( 'AND', 'surecart' ) }
									</span>
								</div>
							</div>
						) }
						<div
							className="sc-rules--group_rules"
							data-rule-id={ rule_id }
							key={ rule_id }
              css={css`
                background: #ffffff;
                padding: 15px 14px;
                border: 1px #d4d4d4 solid;
              `}
						>
							<input
								type="hidden"
								name={ `sc-form-rules[${ g_index }][rules][${ r_index }][rule_id]` }
								value={ rule_id }
							/>

							<div className="sc-checkout-rules--rule_fields">
								<SelectControl
									name={ `sc-form-rules[${ g_index }][rules][${ r_index }][condition]` }
									options={ conditions_select }
                  onChange={ ( selection ) => { updateConditionInRuleGroup( group_id, rule_id, selection ); } }
									value={ rule_data.condition }
								/>
								<SelectControl
									name={ `sc-form-rules[${ g_index }][rules][${ r_index }][operator]` }
									options={ rule_field_data.operator }
									value={ rule_data.operator }
                  onChange={ ( selection ) => { updateConditionOptionInRuleGroup( group_id, rule_id, selection, 'operator' ); } }
								/>

								{ valueFields(
									rule_field_data.fields,
									r_index,
									rule_data
								) }
							</div>
							<div className="sc-rules--rule_actions">
								{ removeConditionIcon( rules.length, r_index, rule_id ) }
							</div>
						</div>
					</>
				);
			} ) }
		</Fragment>
	);
}

export default Conditions;
