/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScCard,
	ScInput,
	ScPriceInput,
	ScSelect,
	ScSkeleton,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';

import apiFetch from '@wordpress/api-fetch';
import DateTimePicker from './DateTimePicker';

export default ({ ruleSchema = [], addRuleGroup, id, totalRuleGroups }) => {
	const [attribute, setAttribute] = useState(null);
	const [operator, setOperator] = useState(null);
	const [value, setValue] = useState(null);
	let operators = [];
	let attributes = [];

	for (const rule of ruleSchema) {
		const operatorsChoices = [];
		for (const operator of rule.operators) {
			operatorsChoices.push({
				label: operator,
				value: operator,
			});
		}
		operators[rule.key] = operatorsChoices;
		attributes.push({
			label: rule.label,
			value: rule.key,
		});
	}

	const renderValueInput = () => {
		switch (attribute) {
			case 'created_at':
			case 'customer.created_at':
			case 'products.created_at':
				return (
					<DateTimePicker
						showLabel={false}
						currentDate={value}
						setDate={(date) => setValue(date)}
					/>
				);
			case 'subtotal_amount':
				return (
					<ScPriceInput
						value={value}
						onChange={(e) => setValue(e.target.value)}
						currency={scData?.currency_code}
						placeholder={__('Enter an amount', 'surecart')}
					/>
				);
			case 'customer.email':
			case 'customer.first_name':
			case 'products.name':
				return (
					<ScInput
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder={__('Enter a value', 'surecart')}
					/>
				);
			default:
				return (
					<ScInput
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder={__('Enter a value', 'surecart')}
					/>
				);
		}
	};

	return (
		<ScCard>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
					grid-template-columns: 1fr 1fr 1fr;
				`}
			>
				<ScSelect
					placeholder={__('Select an attribute', 'surecart')}
					unselect={false}
					value={attribute}
					css={css`
						min-width: 125px;
					`}
					onScChange={(e) => {
						setAttribute(e.target.value);
					}}
					choices={attributes}
				/>
				<ScSelect
					placeholder={__('Select an operator', 'surecart')}
					unselect={false}
					value={operator}
					css={css`
						min-width: 125px;
					`}
					onScChange={(e) => {
						setOperator(e.target.value);
					}}
					choices={operators[attribute] || []}
				/>
				{renderValueInput()}
			</div>
			{totalRuleGroups === id && (
				<ScButton
					type="link"
					css={css`
						text-align: left;
						--sc-button-link-color: #388051;
					`}
					onClick={addRuleGroup}
				>
					{__('+ AND', 'surecart')}
				</ScButton>
			)}
		</ScCard>
	);
};
