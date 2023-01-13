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
import Select2 from './select2';
import { countryChoices } from '@surecart/components';
import { ScPriceInput } from '@surecart/components-react';

function Conditions(props) {
	const {
		rules,
		groupIndex,
		groupsLength,
		removeConditionFromRuleGroup,
		updateConditionInRuleGroup,
		updateConditionOptionInRuleGroup,
	} = props;

	const getProcessorLists = function () {
		let processors = [];

		if (scBlockData?.processors) {
			scBlockData.processors.map((processor) => {
				switch (processor.processor_type) {
					case 'stripe':
						processors.push({
							label: __('Stripe', 'surecart'),
							value: processor.processor_type,
						});
						break;

					case 'paypal':
						processors.push({
							label: __('PayPal', 'surecart'),
							value: processor.processor_type,
						});
						break;
				}
			});
		}

		if (scBlockData?.manualPaymentMethods) {
			scBlockData.manualPaymentMethods.map((payment_method) => {
				processors.push({
					label: payment_method.name,
					value: payment_method.id,
				});
			});
		}

		return processors;
	};

	const conditions_select = [
		{ label: __('Product(s)', 'surecart'), value: 'cart_item' },
		{ label: __('Total', 'surecart'), value: 'cart_total' },
		{ label: __('Coupon(s)', 'surecart'), value: 'cart_coupons' },
		{
			label: __('Payment Processor', 'surecart'),
			value: 'cart_payment_method',
		},
		{
			label: __('Billing country', 'surecart'),
			value: 'cart_billing_country',
		},
		{
			label: __('Shipping country', 'surecart'),
			value: 'cart_shipping_country',
		},
	];
	const stringOperators = [
		{
			label: __('matches any of', 'surecart'),
			value: 'any',
		},
		{
			label: __('matches all of', 'surecart'),
			value: 'all',
		},
		{
			label: __('matches none of', 'surecart'),
			value: 'none',
		},
	];
	const mathOperators = [
		{
			label: __('is equal to', 'surecart'),
			value: '==',
		},
		{
			label: __('is not equal to', 'surecart'),
			value: '!=',
		},
		{
			label: __('is greater than', 'surecart'),
			value: '>',
		},
		{
			label: __('is less than', 'surecart'),
			value: '<',
		},
		{
			label: __('is greater or equal to', 'surecart'),
			value: '>=',
		},
		{
			label: __('is less or equal to', 'surecart'),
			value: '<=',
		},
	];
	const couponOperators = [
		{
			label: __('matches any of', 'surecart'),
			value: 'any',
		},
		{
			label: __('matches all of', 'surecart'),
			value: 'all',
		},
		{
			label: __('matches none of', 'surecart'),
			value: 'none',
		},
		{
			label: __('exist', 'surecart'),
			value: 'exist',
		},
		{
			label: __('not exist', 'surecart'),
			value: 'not_exist',
		},
	];
	const shippingOperators = [
		{
			label: __('matches any of', 'surecart'),
			value: 'any',
		},
		{
			label: __('matches none of', 'surecart'),
			value: 'none',
		},
	];
	const rule_settings_field_data = {
		cart_item: {
			operator: stringOperators,
			fields: [
				{
					type: 'products',
					placeholder: __('Search for products..', 'surecart'),
					isMulti: true,
				},
			],
		},
		cart_total: {
			operator: mathOperators,
			fields: [
				{
					type: 'price',
				},
			],
		},
		cart_coupons: {
			operator: couponOperators,
			fields: [
				{
					type: 'coupons',
					placeholder: __('Search for coupons..', 'surecart'),
					isMulti: true,
				},
			],
		},
		cart_billing_country: {
			operator: shippingOperators,
			fields: [
				{
					type: 'select2',
					placeholder: __('Search for country..', 'surecart'),
					isMulti: true,
					options: countryChoices,
				},
			],
		},
		cart_shipping_country: {
			operator: shippingOperators,
			fields: [
				{
					type: 'select2',
					placeholder: __('Search for country..', 'surecart'),
					isMulti: true,
					options: countryChoices,
				},
			],
		},
		cart_payment_method: {
			operator: shippingOperators,
			fields: [
				{
					type: 'select2',
					placeholder: __('Search for payment method..', 'surecart'),
					isMulti: true,
					options: getProcessorLists(),
				},
			],
		},
	};

	const valueFields = function (fields, ruleIndex, rule_data) {
		let renderFields = '';
		const value = rule_data.value;
		const name = `sc-form-rules[${groupIndex}][rules][${ruleIndex}][value]`;

		return fields.map((field) => {
			switch (field.type) {
				case 'products':
					renderFields = (
						<SelectProducts
							name={`${name}[]`}
							value={value}
							placeholder={field.placeholder}
							tooltip={field.tooltip}
							options={field.options}
							isMulti={field.isMulti}
							onChangeCB={(selection) => {
								updateConditionOptionInRuleGroup(
									ruleIndex,
									selection,
									'value'
								);
							}}
						/>
					);
					break;

				case 'coupons':
					if (
						'exist' === rule_data.operator ||
						'not_exist' === rule_data.operator
					) {
						// If required we will add field here for these two option
					} else {
						renderFields = (
							<SelectCoupons
								name={`${name}[]`}
								value={value}
								placeholder={field.placeholder}
								tooltip={field.tooltip}
								options={field.options}
								isMulti={field.isMulti}
								onChangeCB={(selection) => {
									updateConditionOptionInRuleGroup(
										ruleIndex,
										selection,
										'value'
									);
								}}
							/>
						);
					}
					break;
				case 'select':
					renderFields = (
						<SelectControl
							name={`${name}[]`}
							value={value}
							placeholder={field.placeholder}
							tooltip={field.tooltip}
							options={field.options}
							isMulti={field.isMulti}
							onChange={(selection) => {
								updateConditionOptionInRuleGroup(
									ruleIndex,
									selection,
									'value'
								);
							}}
						/>
					);
					break;
				case 'select2':
					renderFields = (
						<Select2
							name={`${name}[]`}
							value={value}
							placeholder={field.placeholder}
							tooltip={field.tooltip}
							options={field.options}
							isMulti={field.isMulti}
							onChangeCB={(selection) => {
								updateConditionOptionInRuleGroup(
									ruleIndex,
									selection,
									'value'
								);
							}}
						/>
					);
					break;

				case 'price':
					renderFields = (
						<ScPriceInput
							name={`${name}[]`}
							value={value}
							currencyCode={scBlockData?.currency}
							label={''}
							placeholder={field.placeholder}
							help={field.tooltip}
							onScInput={(e) => {
								updateConditionOptionInRuleGroup(
									ruleIndex,
									e.target.value,
									'value'
								);
							}}
						></ScPriceInput>
					);
					break;

				case 'number':
					renderFields = (
						<NumberControl
							name={name}
							value={value}
							placeholder={field.placeholder}
							tooltip={field.tooltip}
							onChange={(selection) => {
								updateConditionOptionInRuleGroup(
									ruleIndex,
									selection,
									'value'
								);
							}}
							isShiftStepEnabled={true}
							shiftStep={1}
						/>
					);
					break;

				case 'text':
					renderFields = (
						<TextControl
							name={name}
							value={value}
							placeholder={field.placeholder}
							tooltip={field.tooltip}
							onChange={(selection) => {
								updateConditionOptionInRuleGroup(
									ruleIndex,
									selection,
									'value'
								);
							}}
						/>
					);
					break;
				default:
			}
			return renderFields;
		});
	};

	const removeConditionIcon = function (rulesLength, ruleIndex) {
		if (1 === rulesLength && 1 === groupsLength) {
			return '';
		}
		return (
			<div
				className="button"
				onClick={() => {
					removeConditionFromRuleGroup(ruleIndex);
				}}
			>
				{__('Remove Condition', 'surecart')}
			</div>
		);
	};

	return (
		<Fragment>
			{rules.map((rule, ruleIndex) => {
				const rule_data = rules[ruleIndex];
				const rule_field_data =
					rule_settings_field_data[rule_data.condition];

				return (
					<>
						{0 !== ruleIndex && (
							<div className="sc-rules--group_rules__condition-label">
								<div
									className="sc--condition-label__and_group"
									css={css`
										padding: 4px 6px;
										border: 1px solid #d4d4d4;
										margin: 15px auto;
										width: 48px;
										text-align: center;
									`}
								>
									<span className="sc--condition-label__and_group__text">
										{__('AND', 'surecart')}
									</span>
								</div>
							</div>
						)}
						<div
							className="sc-rules--group_rules"
							css={css`
								background: #ffffff;
								padding: 15px 14px;
								border: 1px #d4d4d4 solid;
							`}
						>
							<div className="sc-rules--rule_fields">
								<SelectControl
									name={`sc-form-rules[${groupIndex}][rules][${ruleIndex}][condition]`}
									options={conditions_select}
									onChange={(selection) => {
										updateConditionInRuleGroup(
											ruleIndex,
											selection
										);
									}}
									value={rule_data.condition}
								/>
								<SelectControl
									name={`sc-form-rules[${groupIndex}][rules][${ruleIndex}][operator]`}
									options={rule_field_data.operator}
									value={rule_data.operator}
									onChange={(selection) => {
										updateConditionOptionInRuleGroup(
											ruleIndex,
											selection,
											'operator'
										);
									}}
								/>

								{valueFields(
									rule_field_data.fields,
									ruleIndex,
									rule_data
								)}
							</div>
							<div
								className="sc-rules--rule_actions"
								css={css`
									margin-top: 15px;
								`}
							>
								{removeConditionIcon(rules.length, ruleIndex)}
							</div>
						</div>
					</>
				);
			})}
		</Fragment>
	);
}

export default Conditions;
