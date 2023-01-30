/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

// selectors.
import SelectProducts from './selectors/SelectProducts';
import SelectCoupons from './selectors/SelectCoupons';
import SelectProcessors from './selectors/SelectProcessors';
import SelectConditions from './selectors/SelectConditions';
import SelectOperator from './selectors/SelectOperator';
import Select2 from './selectors/Select2';

import { countryChoices } from '@surecart/components';
import {
	ScPriceInput,
	ScCard,
	ScButton,
	ScIcon,
	ScFlex,
} from '@surecart/components-react';

const RULE_SETTINGS_FIELDS = {
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
	processors: {
		operatorType: 'shipping',
		fields: [
			{
				type: 'processors',
				placeholder: __('Search for payment method...', 'surecart'),
			},
		],
	},
};

function Conditions(props) {
	const {
		rules,
		groupIndex,
		groupsLength,
		removeConditionFromRuleGroup,
		updateConditionInRuleGroup,
		updateConditionOptionInRuleGroup,
	} = props;

	const renderValueFields = (fields, ruleIndex, { value, operator }) => {
		return (fields || []).map((field) => {
			switch (field.type) {
				case 'products':
					return (
						<SelectProducts
							value={value}
							placeholder={field.placeholder}
							onChange={(selection) => {
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
								value={value}
								placeholder={field.placeholder}
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

				case 'select':
					return (
						<SelectControl
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

				case 'processors':
					return (
						<SelectProcessors
							value={value}
							placeholder={field.placeholder}
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
			<ScButton
				circle
				css={css`
					--sc-input-height-medium: 30px;
					position: absolute;
					top: -10px;
					right: -10px;
				`}
				onClick={() => {
					removeConditionFromRuleGroup(ruleIndex);
				}}
			>
				<ScIcon name="trash" />
			</ScButton>
		);
	};

	return (
		<Fragment>
			{rules.map((_, ruleIndex) => {
				const ruleData = rules[ruleIndex];
				const ruleFieldData =
					RULE_SETTINGS_FIELDS?.[ruleData?.condition];
				if (!ruleFieldData) return;

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
								position: 'relative',
							}}
						>
							<ScFlex alignItems="center">
								<div
									css={css`
										flex: 1;
										display: grid;
										gap: var(--sc-spacing-small);
									`}
								>
									<ScFlex>
										<SelectConditions
											css={css`
												flex: 1;
											`}
											onChange={(selection) =>
												updateConditionInRuleGroup(
													ruleIndex,
													selection
												)
											}
											value={ruleData.condition}
										/>

										<SelectOperator
											css={css`
												flex: 1;
											`}
											type={ruleFieldData?.operatorType}
											value={ruleData.operator}
											onChange={(selection) => {
												updateConditionOptionInRuleGroup(
													ruleIndex,
													selection,
													'operator'
												);
											}}
										/>
									</ScFlex>

									{renderValueFields(
										ruleFieldData.fields,
										ruleIndex,
										ruleData
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
