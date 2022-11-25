/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
// import { useStateValue } from '@Utils/StateProvider';
// import './conditions.scss';
import { Fragment } from '@wordpress/element';
// import {
// 	SelectField,
// 	ProductField,
// 	NumberField,
// 	CouponField,
// 	Select2Field,
// } from '@Fields';
import {
	TextControl,
	SelectControl,
	ToggleControl,
  Button,
} from '@wordpress/components';

// import ReactHtmlParser from 'react-html-parser';

function Conditions( { rules, group_id, g_index, groups_length, removeConditionFromRuleGroup, updateConditionInRuleGroup } ) {
	// const [ { page_settings }, dispatch ] = useStateValue();

	// const rule_settings = page_settings.settings.rules;
	// const conditions_select = rule_settings.conditions;
	const rule_settings = [];
  const conditions_select = [
    { label: "Product(s)", value: "cart_item" },
    { label: "Total", value: "cart_total" }
  ];
  const rule_settings_field_data = {
    "cart_item": {
        "operator": [
            {
                "label": "matches any of",
                "value": "any"
            },
            {
                "label": "matches all of",
                "value": "all"
            },
            {
                "label": "matches none of",
                "value": "none"
            }
        ],
        "fields": [
            {
                "type": "text",
                "placeholder": "Search for products..",
                "isMulti": true
            }
        ]
    },
    "cart_total": {
        "operator": [
            {
                "label": "is equal to",
                "value": "=="
            },
            {
                "label": "is not equal to",
                "value": "!="
            },
            {
                "label": "is greater than",
                "value": ">"
            },
            {
                "label": "is less than",
                "value": "<"
            },
            {
                "label": "is greater or equal to",
                "value": ">="
            },
            {
                "label": "is less or equal to",
                "value": "<="
            }
        ],
        "fields": [
            {
                "type": "number"
            }
        ]
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
		const value = rule_data.value;

		let rendorfields = '';
		const name = `wcf-checkout-rules[${ g_index }][rules][${ r_index }][value]`;

		return fields.map( ( field ) => {
			switch ( field.type ) {
				case 'select':
					rendorfields = (
						<SelectControl
							name={ `${ name }[]` }
							value={ value }
							placeholder={ field.placeholder }
							tooltip={ field.tooltip }
							options={ field.options }
							isMulti={ field.isMulti }
						/>
					);
					break;

				case 'number':
        case 'text':
					rendorfields = (
						<TextControl
							name={ name }
							value={ value }
							placeholder={ field.placeholder }
							tooltip={ field.tooltip }
						/>
					);
					break;
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
								name={ `wcf-checkout-rules[${ g_index }][rules][${ r_index }][rule_id]` }
								value={ rule_id }
							/>

							<div className="wcf-checkout-rules--rule_fields">
								<SelectControl
									name={ `wcf-checkout-rules[${ g_index }][rules][${ r_index }][condition]` }
									options={ conditions_select }
									onSelect={ () => {
                    updateConditionInRuleGroup( group_id, rule_id );
									} }
                  onChange={ ( selection ) => { updateConditionInRuleGroup( group_id, rule_id, selection ); } }
									value={ rule_data.condition }
								/>
								<SelectControl
									name={ `wcf-checkout-rules[${ g_index }][rules][${ r_index }][operator]` }
									options={ rule_field_data.operator }
									value={ rule_data.operator }
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
