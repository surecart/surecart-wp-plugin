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
	ScIcon,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';

import apiFetch from '@wordpress/api-fetch';
import DateTimePicker from './DateTimePicker';

export default ({
	ruleSchema = [],
	addRuleGroup,
	removeRuleGroup,
	id,
	totalRuleGroups,
}) => {
	const [attribute, setAttribute] = useState(null);
	const [operator, setOperator] = useState(null);
	const [value, setValue] = useState(null);
	const [metadataKey, setMetadataKey] = useState(null);

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

	const isAttributeMetadata = attribute
		? attribute.endsWith('.metadata') || 'metadata' === attribute
		: false;

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
					onScChange={(e) => {
						setAttribute(e.target.value);
					}}
					choices={attributes}
				/>
				{isAttributeMetadata && (
					<ScInput
						value={metadataKey}
						onChange={(e) => setMetadataKey(e.target.value)}
						placeholder={__('Enter a key', 'surecart')}
					/>
				)}
				<ScSelect
					placeholder={__('Select an operator', 'surecart')}
					unselect={false}
					value={operator}
					onScChange={(e) => {
						setOperator(e.target.value);
					}}
					choices={operators[attribute] || []}
				/>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					{renderValueInput()}
					<ScIcon
						name="trash"
						tabindex="0"
						onClick={removeRuleGroup}
						css={css`
							width: 10%;
							cursor: pointer;
							transition: color var(--sc-transition-medium)
								ease-in-out;
							color: var(--sc-color-gray-600);
							&:hover {
								color: var(--sc-color-danger-500);
							}
						`}
					/>
				</div>
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
