/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useEntityRecord } from '@wordpress/core-data';

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
import DateTimePicker from './DateTimePicker';
import { formatDateTime } from '../../util/time';
import { getInputType } from '../utils/ruleQueryUtils';
import { attributeLabels, operatorLabels } from '../utils/labelTranslations';

export default ({
	addLeaf,
	removeLeaf,
	totalLeaves,
	leafIndex,
	groupIndex,
	rules,
	updateRuleJson,
	leaf,
	feeTarget,
}) => {
	const [attribute, setAttribute] = useState(leaf?.attribute_name || null);
	const [operator, setOperator] = useState(leaf?.operator_label || null);
	const [value, setValue] = useState(leaf?.comparison_value || null);
	const [metadataKey, setMetadataKey] = useState(leaf?.metadata_key || null);
	const { record: ruleSchema } = useEntityRecord(
		'surecart',
		'rule-schema',
		feeTarget
	);

	// Function to update the rules when any field changes
	const updateCurrentLeaf = () => {
		const newRuleJson = JSON.parse(JSON.stringify(rules));

		newRuleJson.conditions[groupIndex].conditions[leafIndex] = {
			type: 'condition',
			attribute_name: attribute,
			operator_label: operator,
			comparison_value: value?.toString() || '',
			...(metadataKey ? { metadata_key: metadataKey } : {}),
		};

		updateRuleJson(newRuleJson);
	};

	// Initialize from existing leaf if available
	useEffect(() => {
		if (leaf) {
			setAttribute(leaf.attribute_name);
			setValue(leaf.comparison_value);
			setMetadataKey(leaf.metadata_key);
			setOperator(leaf.operator_label);
		}
	}, [leaf]);

	let operators = [];
	let attributes = [];

	for (const rule of ruleSchema?.rule_schema ?? []) {
		const operatorsChoices = [];
		for (const operator of rule.operators) {
			operatorsChoices.push({
				label: operatorLabels?.[operator],
				value: operator,
			});
		}
		operators[rule.key] = operatorsChoices;
		attributes.push({
			label: attributeLabels?.[rule.key],
			value: rule.key,
			supported_values: rule?.supported_values,
		});
	}

	useEffect(() => {
		if (attribute === null) {
			return;
		}
		updateCurrentLeaf();
	}, [operator, value, metadataKey]);

	const isAttributeMetadata = attribute
		? attribute.endsWith('.metadata') || 'metadata' === attribute
		: false;

	const attributeSupportedValues =
		(attributes ?? []).find((attr) => attr.value === attribute)
			?.supported_values || [];

	const userRoleChoices = Object.entries(scData?.wp_user_roles).map(
		([key, value]) => ({
			label: value?.name,
			value: key,
		})
	);

	const formatLabel = (str) =>
		str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

	const renderSupportedValuesSelector = () => {
		return (
			<ScSelect
				value={value}
				onScChange={(e) => setValue(e.target.value)}
				choices={(attributeSupportedValues ?? []).map((val) => ({
					label: formatLabel(val),
					value: val,
				}))}
			/>
		);
	};

	const renderValueInput = () => {
		const inputType = getInputType(attribute);
		switch (inputType) {
			case 'date':
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
			case 'price':
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
			case 'text':
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
			case 'email':
				return (
					<ScInput
						type="email"
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
			case 'number':
				return (
					<ScInput
						type="number"
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
			case 'user_role':
				return (
					<ScSelect
						value={value}
						onScChange={(e) => {
							setValue(e.target.value);
						}}
						choices={userRoleChoices}
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
						// Reset values when the attribute changes.
						setValue(null);
						setOperator(null);
						setMetadataKey(null);
					}}
					choices={attributes}
				/>
				{isAttributeMetadata && attribute !== 'wp_user_role' && (
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

				{attributeSupportedValues?.length
					? renderSupportedValuesSelector()
					: renderValueInput()}
				<ScButton
					circle
					css={css`
						--sc-input-height-medium: 30px;
						position: absolute;
						top: -8px;
						right: -8px;
					`}
					onClick={removeLeaf}
				>
					<ScIcon name="trash" />
				</ScButton>
			</div>
			{totalLeaves === leafIndex + 1 && (
				<ScButton
					type="link"
					css={css`
						text-align: left;
						--sc-button-link-color: #388051;
					`}
					onClick={addLeaf}
				>
					{__('+ AND', 'surecart')}
				</ScButton>
			)}
		</ScCard>
	);
};
