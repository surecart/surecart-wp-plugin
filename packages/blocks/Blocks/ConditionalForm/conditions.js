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
import {
	ScPriceInput,
	ScCard,
	ScButton,
	ScTag,
	ScIcon,
	ScFlex,
} from '@surecart/components-react';
import SelectConditions from './selectConditions';
import SelectOperator from './selectOperator';

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

	const rule_settings_field_data = {
		products: {
			operatorType: 'string',
			fields: [
				{
					type: 'products',
					placeholder: __('Search for products..', 'surecart'),
					isMulti: true,
				},
			],
		},
		total: {
			operatorType: 'math',
			fields: [
				{
					type: 'price',
				},
			],
		},
		coupons: {
			operatorType: 'coupon',
			fields: [
				{
					type: 'coupons',
					placeholder: __('Search for coupons..', 'surecart'),
					isMulti: true,
				},
			],
		},
		billing_country: {
			operatorType: 'shipping',
			fields: [
				{
					type: 'select2',
					placeholder: __('Search for country..', 'surecart'),
					isMulti: true,
					options: countryChoices,
				},
			],
		},
		shipping_country: {
			operatorType: 'shipping',
			fields: [
				{
					type: 'select2',
					placeholder: __('Search for country..', 'surecart'),
					isMulti: true,
					options: countryChoices,
				},
			],
		},
		payment_methods: {
			operatorType: 'shipping',
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

	const renderValueFields = function (
		fields,
		ruleIndex,
		{ value, operator }
	) {
		const name = `sc-form-rules[${groupIndex}][rules][${ruleIndex}][value]`;

		return fields.map((field) => {
			switch (field.type) {
				case 'products':
					return (
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

				case 'coupons':
					if ('exist' === operator || 'not_exist' === operator) {
						// If required we will add field here for these two option
					} else {
						return (
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

				case 'select':
					return (
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

				case 'select2':
					return (
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

				case 'price':
					return (
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

				case 'number':
					return (
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

				case 'text':
					return (
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
			}
		});
	};

	const renderRemoveConditionIcon = function (rulesLength, ruleIndex) {
		if (1 === rulesLength && 1 === groupsLength) {
			return '';
		}
		return (
			<div className="sc-rules--rule_actions">
				<ScButton
					circle
					css={css`
						--sc-input-height-medium: 30px;
					`}
					onClick={() => {
						removeConditionFromRuleGroup(ruleIndex);
					}}
				>
					<ScIcon name="trash" />
				</ScButton>
			</div>
		);
	};

	return (
		<Fragment>
			{rules.map((_, ruleIndex) => {
				const rule_data = rules[ruleIndex];
				const rule_field_data =
					rule_settings_field_data[rule_data.condition];
				return (
					<>
						{0 !== ruleIndex && (
							<div
								css={css`
									text-align: center;
									margin: 15px auto;
									pointer-events: none;
								`}
							>
								<ScButton pill size="small">
									{__('AND', 'surecart')}
								</ScButton>
							</div>
						)}
						<ScCard
							className="sc-rules--group_rules-card"
							style={{
								background: '#ffffff',
								flex: 1,
							}}
						>
							<ScFlex alignItems="center">
								<div
									css={css`
										flex: 1;
									`}
								>
									<ScFlex>
										<SelectConditions
											css={css`
												flex: 1;
											`}
											name={`sc-form-rules[${groupIndex}][rules][${ruleIndex}][condition]`}
											onScChange={(e) => {
												updateConditionInRuleGroup(
													ruleIndex,
													e.target.value
												);
											}}
											value={rule_data.condition}
										/>

										<SelectOperator
											css={css`
												flex: 1;
											`}
											name={`sc-form-rules[${groupIndex}][rules][${ruleIndex}][operator]`}
											type={rule_field_data.operatorType}
											value={rule_data.operator}
											onScChange={(e) => {
												updateConditionOptionInRuleGroup(
													ruleIndex,
													e.target.value,
													'operator'
												);
											}}
										/>
									</ScFlex>

									{renderValueFields(
										rule_field_data.fields,
										ruleIndex,
										rule_data
									)}
								</div>

								{renderRemoveConditionIcon(
									rules.length,
									ruleIndex
								)}
							</ScFlex>
						</ScCard>
					</>
				);
			})}
		</Fragment>
	);
}

export default Conditions;
