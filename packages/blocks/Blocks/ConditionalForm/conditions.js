/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
// import React from 'react'
// import Select from 'react-select'
import SelectProducts from './selectProducts';
import SelectCoupons from './selectCoupons';

// import ReactHtmlParser from 'react-html-parser';

function Conditions( props ) {
	// const [ { page_settings }, dispatch ] = useStateValue();

  const { rules, group_id, g_index, groups_length, removeConditionFromRuleGroup, updateConditionInRuleGroup, updateConditionOptionInRuleGroup } = props;
	// const rule_settings = page_settings.settings.rules;
	// const conditions_select = rule_settings.conditions;



	const rule_settings = [];
  const conditions_select = [
    { label: __( 'Product(s)', 'surecart' ), value: 'cart_item' },
    { label: __( 'Total', 'surecart' ), value: 'cart_total' },
    { label: __( 'Coupon(s)', 'surecart' ), value: 'cart_coupons' },
    { label: __( 'Payment Processor', 'surecart' ), value: 'cart_payment_method' },
    { label: __( 'Shipping country', 'surecart' ), value: 'cart_shipping_country' },
    { label: __( 'Billing country', 'surecart' ), value: 'cart_billing_country' }
  ];
  const stringOperators = [
    {
        'label': 'matches any of',
        'value': 'any'
    },
    {
        'label': 'matches all of',
        'value': 'all'
    },
    {
        'label': 'matches none of',
        'value': 'none'
    }
  ];
  const mathOperators = [
    {
        'label': 'is equal to',
        'value': '=='
    },
    {
        'label': 'is not equal to',
        'value': '!='
    },
    {
        'label': 'is greater than',
        'value': '>'
    },
    {
        'label': 'is less than',
        'value': '<'
    },
    {
        'label': 'is greater or equal to',
        'value': '>='
    },
    {
        'label': 'is less or equal to',
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
                'placeholder': 'Search for products..',
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
          'placeholder': __( 'Search for coupons..', 'cartflows-pro' ),
          'isMulti': true,
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
          'options': [{ 'label': 'India', 'value': 'IN' }],
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
          'options': [{ 'label': 'India', 'value': 'IN' }],
        },
      ],
    },
    'cart_payment_method': {
      'operator': shippingOperators,
      'fields': [
        {
          'type': 'select',
          'placeholder': __( 'Search for payment method..', 'cartflows-pro' ),
          'isMulti': true,
          'options': [{ 'label': 'Stripe', 'value': 'stripe' }],
        },
      ],
    },
  }


	const removeCondition = ( event ) => {
    debugger
		const rule_id = event.target.getAttribute( 'rule_id' );

		if ( group_id && rule_id ) {
      removeConditionFromRuleGroup( group_id, rule_id );
		}
	};

	const valueFields = function ( fields, r_index, rule_data ) {
    debugger;
		const value = rule_data.value;
    const rule_id = rule_data.rule_id;

		let rendorfields = '';
		const name = `sc-checkout-rules[${ g_index }][rules][${ r_index }][value]`;

		return fields.map( ( field ) => {
      // debugger;
			switch ( field.type ) {
				case 'products':
          debugger
					rendorfields = (
            <SelectProducts
							name={ `${ name }[]` }
							value={ value }
							placeholder={ field.placeholder }
							tooltip={ field.tooltip }
							options={ field.options }
							isMulti={ field.isMulti }
              onChangeCB={ ( selection ) => { debugger; updateConditionOptionInRuleGroup( group_id, rule_id, selection, 'value' ); } }
						/>
					);
					break;

        case 'coupons':
          debugger
					rendorfields = (
            <SelectCoupons
							name={ `${ name }[]` }
							value={ value }
							placeholder={ field.placeholder }
							tooltip={ field.tooltip }
							options={ field.options }
							isMulti={ field.isMulti }
              onChangeCB={ ( selection ) => { debugger; updateConditionOptionInRuleGroup( group_id, rule_id, selection, 'value' ); } }
						/>
					);
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

	const removeConditionIcon = function ( rules_length, rule_id ) {
		if ( 1 === rules_length && 1 === groups_length ) {
			return '';
		}
		return (
      <div className='button' css={css`margin-top:15px;`}
        onClick={ removeCondition }
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
										AND
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
								name={ `sc-checkout-rules[${ g_index }][rules][${ r_index }][rule_id]` }
								value={ rule_id }
							/>

							<div className="sc-checkout-rules--rule_fields">
								<SelectControl
									name={ `sc-checkout-rules[${ g_index }][rules][${ r_index }][condition]` }
									options={ conditions_select }
                  onChange={ ( selection ) => { updateConditionInRuleGroup( group_id, rule_id, selection ); } }
									value={ rule_data.condition }
								/>
								<SelectControl
									name={ `sc-checkout-rules[${ g_index }][rules][${ r_index }][operator]` }
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
								{ removeConditionIcon( rules.length, rule_id ) }
							</div>
						</div>
					</>
				);
			} ) }
		</Fragment>
	);
}

export default Conditions;
