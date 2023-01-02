/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import Conditions from './conditions';


const Rules = ( props ) => {

	const { attributes, setAttributes, closeModal } = props;

	const { rule_groups } = attributes;

	const getInitialGroups = function() {

		let defaultData = [
			{
				"group_id": Math.random().toString( 36 ).substring( 2, 5 ),
				"rules": [
					{
						rule_id: Math.random().toString( 36 ).substring( 2, 5 ),
						condition: "cart_item",
						operator: "any",
						value: ""
					}
				]
			},
		];

		// Deep clone hack.
		let rgData = rule_groups?.length > 0 ? JSON.parse( JSON.stringify( rule_groups ) ) : defaultData;

		return rgData;
	};

	const [ ruleGroupsData, setRuleGroupsData ] = useState( getInitialGroups() );

	console.log( 'rule_groups' )
	console.log( rule_groups )
	console.log( 'ruleGroupsData' );
	console.log( ruleGroupsData );

	const updateRuleGroupData = function( data ) {
		// setAttributes({ rule_groups: data });
		setRuleGroupsData( [...data] );
	};
	const addConditionToRuleGroup = function( groupId, newCondition ) {

		if ( ruleGroupsData && groupId ) {
			for ( const ruleGroup of ruleGroupsData ) {
				if ( groupId === ruleGroup.group_id ) {
					ruleGroup.rules.push( newCondition );
					break;
				}
			}

			// setAttributes({ rule_groups: ruleGroupsData });
			setRuleGroupsData( [...ruleGroupsData] );
		}
	};

	const removeConditionFromRuleGroup = function( groupIndex, conditionIndex ) {
		debugger;
		const newGroupData = ruleGroupsData.filter( ( group, i ) => {
			if ( i === groupIndex ) {

				group.rules = group.rules.filter( ( rule, j ) => {
					if ( j === conditionIndex ) {
						return false;
					}
					return true;
				} );

				if ( group.rules.length === 0 ) {
					return false;
				}
			}
			return true;
		});

		// setAttributes({ rule_groups: newGroupData });
		setRuleGroupsData( [...newGroupData] );
	};

	const updateConditionInRuleGroup = function( groupIndex, conditionIndex, currentValue ) {

    // debugger;

    let savedRule = ruleGroupsData[groupIndex]['rules'][conditionIndex];

    savedRule.condition = currentValue;
    savedRule.value = '';
    savedRule.operator = 'any';

    if ( 'cart_total' === currentValue ) {
      savedRule.operator = '==';
    }

    ruleGroupsData[groupIndex]['rules'][conditionIndex] = savedRule;

		setRuleGroupsData( [...ruleGroupsData] );
	};
	const updateConditionOptionInRuleGroup = function( groupId, conditionId, currentValue, optionName ) {
		// debugger;
			for ( const group of ruleGroupsData ) {
				if ( groupId === group.group_id ) {
					for ( const rule of group.rules ) {
						if ( conditionId === rule.rule_id ) {
							rule[optionName] = currentValue;
							break;
						}
					}
					break;
				}
			}
			// setAttributes({ rule_groups: ruleGroupsData });
			setRuleGroupsData( [...ruleGroupsData] );
	};

	const addNewCondition = ( event ) => {
		const groupId = event.target.getAttribute( 'group_id' );
		const newCondition = {
			rule_id: Math.random().toString( 36 ).substring( 2, 5 ),
			condition: 'cart_item',
			operator: 'any',
			value: '',
		};

		addConditionToRuleGroup( groupId, newCondition );
	}

	const addNewGroup = function ( event ) {
		// debugger;
		const newGroup = {
			group_id: Math.random().toString( 36 ).substring( 2, 5 ),
			rules: [
				{
					rule_id: Math.random().toString( 36 ).substring( 2, 5 ),
					condition: 'cart_item',
					operator: 'any',
					value: '',
				},
			],
		};

		ruleGroupsData.push( newGroup );
		// setRuleGroupsData( ruleGroupsData );
		updateRuleGroupData( ruleGroupsData );
	}

	const showRules = function ( event ) {
		// rule_groups += 'Hello Sandesh';
		// setAttributes({ rule_groups: ruleGroupsData });
		const group_id = event.target.getAttribute( 'data-group_id' );

		const target = document.getElementById(
			`sc-rules--group-${ group_id }`
		);
		toggle_class( event, target );
	};

	const toggle_class = function ( event, target ) {
		if ( target.classList.contains( 'hidden' ) ) {
			target.classList.remove( 'hidden' );
			event.target.classList.remove( 'dashicons-arrow-down' );
			event.target.classList.add( 'dashicons-arrow-up' );
		} else {
			target.classList.add( 'hidden' );
			event.target.classList.add( 'dashicons-arrow-down' );
			event.target.classList.remove( 'dashicons-arrow-up' );
		}
	};

	const handleFormSubmit = function ( e ) {
		e.preventDefault();

		setAttributes({ rule_groups: ruleGroupsData });

		closeModal();
	};

	return (
		<>
		<form className='sc-rules-group-form' onSubmit={ handleFormSubmit }>
		{ ruleGroupsData.map( ( group, g_index ) => {
			// debugger;
			const group_id = group.group_id;
			const rules = group.rules;
			return (
				<div
					className="sc-rules-page--group_wrapper"
					key={ group_id }
				>
					<div
						className="sc-rules--group"
						data-group-id={ group_id }
						css={css`
							padding: 15px;
							background-color: #fafafa;
							border: 1px dashed #fafafa;
						`}
					>
						<input
							type="hidden"
							name={ `sc-form-rules[${ g_index }][group_id]` }
							value={ group_id }
						/>

						<div className="sc-rules--redirection-step" css={ css`
							display: flex;
							justify-content: space-between;
						`}>
							<div className="sc-rules--group_header__left">
								<span className="sc-rules__handle dashicons dashicons-menu"></span>
                { sprintf( __( 'Rule Group - %s', 'surecart' ), g_index + 1 ) }
							</div>
							<div className="sc-rules--group_header">
								<span className="sc-rules--group_id">
									{ __(
										'ID - ',
										'surecart'
									) }
									{ group_id }
								</span>
								<span
									className={
										'dashicons dashicons-arrow-down'
									}
									onClick={
										showRules
									}
									data-group_id={
										group_id
									}
								></span>
							</div>
						</div>
						<div
							id={ `sc-rules--group-${ group_id }` }
							className={ 'hidden' }
						>
							<div className="sc-rules--group_rules--wrapper" css={css`margin: 15px 0;`}>
								{ rules.length !==
									0 && (
									<Conditions
										rules={ rules }
										group_id={ group_id }
										g_index={ g_index }
										groups_length={ ruleGroupsData.length }
										removeConditionFromRuleGroup={ ( conditionIndex ) => removeConditionFromRuleGroup( g_index, conditionIndex ) }
										updateConditionInRuleGroup={ ( conditionIndex, currentValue ) => { updateConditionInRuleGroup( g_index, conditionIndex, currentValue ) } }
										updateConditionOptionInRuleGroup = { updateConditionOptionInRuleGroup }
									/>
									) }
							</div>

							<div className="sc-rules--add-rule__repeater">
								<div
									className="sc-button sc-button--secondary button"
									group_id={
										group_id
									}
									onClick={
										addNewCondition
									}
								>
									{ __(
										'Add Condition',
										'surecart'
									) }
								</div>
							</div>
						</div>
					</div>
					<div className="sc-rules-page--group_wrapper__footer"
						css={css`margin: 20px 0 0;`}
					>
						{ parseInt( g_index ) + 1 < ruleGroupsData.length &&
						( <div className="sc-rules--or-group"
							css={css`
								padding: 4px 6px;
								border: 1px solid #d4d4d4;
								margin: 15px auto;
								width: 48px;
								text-align: center;
							`}
						>
							<span className="sc-rules--or_group__text">
								{ __(
									'OR',
									'surecart'
								) }
							</span>
						</div> )
						}

						{ parseInt( g_index ) + 1 === ruleGroupsData.length && (
							<div className="sc-rules--or_group__button">
								<span
									className="sc-rules--or_group_button or-button sc-button sc-button--secondary button"
									onClick={
										addNewGroup
									}
								>
									{ __(
										'Add Rule Group',
										'surecart'
									) }
								</span>
							</div>
						) }
					</div>
				</div>
			);
			} )
		}
		<Button variant='secondary' onClick={closeModal}>{ __( 'Cancel', 'surecart' ) }</Button>
		<Button variant="primary" type='submit'>{ __( 'Save', 'surecart' ) }</Button>
		</form>
		</>
	);
};

export default Rules;
