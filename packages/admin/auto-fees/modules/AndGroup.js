/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

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
	ScFlex,
	ScFormControl,
} from '@surecart/components-react';
import DateTimePicker from './DateTimePicker';
import { formatDateTime } from '../../util/time';
import { createEmptyAndRule } from '../utils/ruleQueryUtils';

export default ({
	ruleSchema = [],
	addRuleGroup,
	removeRuleGroup,
	id,
	totalRuleGroups,
	andGroupIndex,
	orGroupIndex,
	rule_query,
	updateRuleQuery,
}) => {
	const [attribute, setAttribute] = useState(null);
	const [operator, setOperator] = useState(null);
	const [value, setValue] = useState(null);
	const [metadataKey, setMetadataKey] = useState(null);

	// Function to update the rule_query when any field changes
	const updateCurrentRule = () => {
		const newRuleQuery = [...rule_query];
		if (!newRuleQuery[orGroupIndex]) {
			newRuleQuery[orGroupIndex] = [];
		}
		if (!newRuleQuery[orGroupIndex][andGroupIndex]) {
			newRuleQuery[orGroupIndex][andGroupIndex] = createEmptyAndRule();
		}

		newRuleQuery[orGroupIndex][andGroupIndex] = {
			attribute: attribute,
			value: value,
			metadataKey: metadataKey,
			operator: operator,
		};

		updateRuleQuery(newRuleQuery);
	};

	// Initialize from existing rule_query if available
	useEffect(() => {
		if (
			rule_query[orGroupIndex] &&
			rule_query[orGroupIndex][andGroupIndex]
		) {
			setAttribute(rule_query[orGroupIndex][andGroupIndex]?.attribute);
			setValue(rule_query[orGroupIndex][andGroupIndex]?.value);
			setMetadataKey(
				rule_query[orGroupIndex][andGroupIndex]?.metadataKey
			);
			setOperator(rule_query[orGroupIndex][andGroupIndex]?.operator);
		}
	}, [orGroupIndex, andGroupIndex, rule_query]);

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

	useEffect(() => {
		//do not run on initial render
		if (attribute === null) {
			return;
		}
		// Reset values when the attribute changes.
		setValue(null);
		setOperator(null);
		setMetadataKey(null);
		// Update rule_query when attribute changes
		updateCurrentRule();
	}, [attribute]);

	useEffect(() => {
		if (attribute === null) {
			return;
		}
		updateCurrentRule();
	}, [operator, value, metadataKey]);

	const isAttributeMetadata = attribute
		? attribute.endsWith('.metadata') || 'metadata' === attribute
		: false;

	const renderValueInput = () => {
		switch (attribute) {
			case 'created_at':
			case 'customer.created_at':
			case 'products.created_at':
				return (
					<DateTimePicker
						showLabel={false}
						currentDate={value}
						setDate={(date) => {
							setValue(date);
						}}
						className={
							!isAttributeMetadata ? 'sc-grid-full-width' : ''
						}
						renderButton={({ isOpen, onToggle, date }) => (
							<ScInput
								value={
									date
										? formatDateTime(date * 1000)
										: __('Set Date', 'surecart')
								}
								onClick={onToggle}
								placeholder={__('Select a date', 'surecart')}
								readonly
								css={css`
									--sc-input-cursor: pointer;
								`}
							>
								<ScIcon
									name="calendar"
									slot="suffix"
									style={{
										width: '20px',
										height: '20px',
										cursor: 'pointer',
									}}
								/>
							</ScInput>
						)}
					/>
				);
			case 'subtotal_amount':
				return (
					<ScPriceInput
						value={value}
						onScInput={(e) => {
							setValue(e.target.value);
						}}
						currency={scData?.currency_code}
						placeholder={__('Enter an amount', 'surecart')}
						className={
							!isAttributeMetadata ? 'sc-grid-full-width' : ''
						}
					/>
				);
			case 'customer.email':
			case 'customer.first_name':
			case 'products.name':
				return (
					<ScInput
						value={value}
						onScInput={(e) => {
							setValue(e.target.value);
						}}
						placeholder={__('Enter a value', 'surecart')}
						className={
							!isAttributeMetadata ? 'sc-grid-full-width' : ''
						}
					/>
				);
			default:
				return (
					<ScInput
						value={value}
						onScInput={(e) => {
							setValue(e.target.value);
						}}
						placeholder={__('Enter a value', 'surecart')}
						className={
							!isAttributeMetadata ? 'sc-grid-full-width' : ''
						}
					/>
				);
		}
	};

	return (
		<ScCard
			css={css`
				position: relative;
			`}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
					grid-template-columns: repeat(
						auto-fill,
						minmax(min(13rem, 100%), 1fr)
					);

					.sc-grid-full-width {
						grid-column: 1 / -1;
					}
					.sc-grid-full-width .components-dropdown {
						width: 100%;
					}
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
						onScInput={(e) => {
							setMetadataKey(e.target.value);
						}}
						placeholder={__("Enter metadata's key", 'surecart')}
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

				{renderValueInput()}
				<ScButton
					circle
					css={css`
						--sc-input-height-medium: 30px;
						position: absolute;
						top: -8px;
						right: -8px;
					`}
					onClick={removeRuleGroup}
				>
					<ScIcon name="trash" />
				</ScButton>
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
