/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useMemo } from '@wordpress/element';
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
import { formatDate } from '../../util/time';
import { getInputType } from '../utils/helper';
import {
	attributeLabels,
	operatorLabels,
	supportedValuesLabels,
	UUID_ENTITY_MAP,
} from '../utils/constants';
import ModelSelector from '../../components/ModelSelector';
import PriceSelector from '../../components/PriceSelector';
import { useCountries } from '../../hooks/useAtlas';

const SEARCH_RESULT_LIMIT = 8;
const ENTITY_DISPLAY = {
	promotion: (item) => item.code || item.id,
};

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
	currencyCode,
}) => {
	const [attribute, setAttribute] = useState(leaf?.attribute_name || null);
	const [operator, setOperator] = useState(leaf?.operator_label || null);
	const [value, setValue] = useState(leaf?.comparison_value || null);
	const [metadataKey, setMetadataKey] = useState(leaf?.metadata_key || null);
	const target = 'shipping' === feeTarget ? 'checkout' : feeTarget;
	const { countries } = useCountries();
	const { record: ruleSchema } = useEntityRecord(
		'surecart',
		'rule-schema',
		target
	);
	// Initialize from existing leaf if available
	useEffect(() => {
		if (leaf) {
			setAttribute(leaf.attribute_name);
			setValue(leaf.comparison_value);
			setMetadataKey(leaf.metadata_key);
			setOperator(leaf.operator_label);
		}
	}, [
		leaf?.attribute_name,
		leaf?.comparison_value,
		leaf?.metadata_key,
		leaf?.operator_label,
	]);

	const { operators, attributes } = useMemo(() => {
		const ops = {};
		const attrs = [];

		for (const rule of ruleSchema?.rule_schema ?? []) {
			const operatorsChoices = rule.operators.map((operator) => ({
				label: operatorLabels?.[operator] || operator,
				value: operator,
			}));

			ops[rule.key] = operatorsChoices;
			attrs.push({
				label: attributeLabels?.[rule.key] || rule.key,
				value: rule.key,
				supported_values: rule?.supported_values,
			});
		}

		return { operators: ops, attributes: attrs };
	}, [ruleSchema]);

	// Update the rules when any field changes
	useEffect(() => {
		if (attribute === null) {
			return;
		}

		const newRuleJson = structuredClone(rules);

		newRuleJson.conditions[groupIndex].conditions[leafIndex] = {
			type: 'condition',
			attribute_name: attribute,
			operator_label: operator,
			comparison_value: value || '',
			...(metadataKey ? { metadata_key: metadataKey } : {}),
		};

		updateRuleJson(newRuleJson);
	}, [attribute, operator, value, metadataKey]);

	const isAttributeMetadata = attribute
		? attribute.endsWith('.metadata') || 'metadata' === attribute
		: false;

	const attributeSupportedValues =
		(attributes ?? []).find((attr) => attr.value === attribute)
			?.supported_values || [];

	const userRoleChoices = useMemo(() => {
		if (!scData?.wp_user_roles) return [];
		return Object.entries(scData.wp_user_roles).map(([key, value]) => ({
			label: value?.name || key,
			value: key,
		}));
	}, []);

	const formatLabel = (str) =>
		str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

	const fullWidthClass = !isAttributeMetadata ? 'sc-grid-full-width' : '';

	const renderSupportedValuesSelector = () => {
		return (
			<ScSelect
				value={value}
				onScChange={(e) => setValue(e.target.value)}
				choices={(attributeSupportedValues ?? []).map((val) => ({
					label: supportedValuesLabels?.[val] || formatLabel(val),
					value: val,
				}))}
				search={
					(attributeSupportedValues ?? []).length >
					SEARCH_RESULT_LIMIT
				}
				required
			/>
		);
	};

	const renderValueInput = () => {
		const inputType = getInputType(attribute, operator);
		switch (inputType) {
			case 'date':
				return (
					<DateTimePicker
						dateTime={false}
						showLabel={false}
						currentDate={value}
						setDate={(date) => {
							setValue(date);
						}}
						className={fullWidthClass}
						renderButton={({ isOpen, onToggle, date }) => (
							<div
								css={css`
									display: flex;
									gap: 4px;
								`}
							>
								<ScInput
									value={
										date
											? formatDate(date * 1000)
											: __('Set Date', 'surecart')
									}
									onClick={onToggle}
									placeholder={__(
										'Select a date',
										'surecart'
									)}
									readonly
									css={css`
										--sc-input-cursor: pointer;
										width: -webkit-fill-available;
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
								<span aria-hidden="true" className="required">
									{' '}
									*
								</span>
							</div>
						)}
					/>
				);
			case 'price':
				return (
					<ScPriceInput
						required
						value={value}
						onScInput={(e) => {
							setValue(e.target.value);
						}}
						currencyCode={currencyCode}
						placeholder={__('Enter an amount', 'surecart')}
						className={fullWidthClass}
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
						className={fullWidthClass}
					/>
				);
			case 'email':
				return (
					<ScInput
						required
						type="email"
						value={value}
						onScInput={(e) => {
							setValue(e.target.value);
						}}
						placeholder={__('Enter a value', 'surecart')}
						className={fullWidthClass}
					/>
				);
			case 'number':
				return (
					<ScInput
						type="number"
						required
						value={value}
						onScInput={(e) => {
							setValue(e.target.value);
						}}
						placeholder={__('Enter a value', 'surecart')}
						className={fullWidthClass}
					/>
				);
			case 'country':
				return (
					<ScSelect
						search={(countries ?? []).length > SEARCH_RESULT_LIMIT}
						searchPlaceholder={__(
							'Search for a country',
							'surecart'
						)}
						searchPlaceholderValue={__(
							'Search for a country...',
							'surecart'
						)}
						value={value}
						onScChange={(e) => {
							setValue(e.target.value);
						}}
						required
						choices={(countries ?? []).map(({ name, code }) => ({
							label: name,
							value: code,
						}))}
					/>
				);
			case 'user_role':
				return (
					<ScSelect
						search={userRoleChoices.length > SEARCH_RESULT_LIMIT}
						searchPlaceholder={__(
							'Search for a user role',
							'surecart'
						)}
						searchPlaceholderValue={__(
							'Search for a user role...',
							'surecart'
						)}
						value={value}
						onScChange={(e) => {
							setValue(e.target.value);
						}}
						required
						choices={userRoleChoices}
					/>
				);
			case 'uuid': {
				const entityName = UUID_ENTITY_MAP[attribute];
				if (!entityName) {
					return (
						<ScInput
							value={value}
							onScInput={(e) => setValue(e.target.value)}
							required
							placeholder={__('Enter a value', 'surecart')}
							className={fullWidthClass}
						/>
					);
				}
				if (entityName === 'price') {
					return (
						<PriceSelector
							value={value}
							onSelect={({ price_id }) => setValue(price_id)}
							required
							className={fullWidthClass}
							includeVariants={false}
							ad_hoc={false}
							requestQuery={{ archived: false }}
						/>
					);
				}
				return (
					<ModelSelector
						name={entityName}
						value={value}
						onSelect={(val) => setValue(val)}
						display={ENTITY_DISPLAY[entityName]}
						placeholder={__('Search...', 'surecart')}
						required
						className={fullWidthClass}
						requestQuery={{
							archived: false,
						}}
					/>
				);
			}
			default:
				return (
					<ScInput
						value={value}
						onScInput={(e) => {
							setValue(e.target.value);
						}}
						required
						placeholder={__('Enter a value', 'surecart')}
						className={fullWidthClass}
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
					search={attributes.length > SEARCH_RESULT_LIMIT}
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
					required
				/>
				{isAttributeMetadata && attribute !== 'wp_user_role' && (
					<ScInput
						value={metadataKey}
						onScInput={(e) => {
							setMetadataKey(e.target.value);
						}}
						placeholder={__("Enter metadata's key", 'surecart')}
						required
					/>
				)}
				<ScSelect
					search={operators[attribute]?.length > SEARCH_RESULT_LIMIT}
					placeholder={__('Select a condition', 'surecart')}
					unselect={false}
					value={operator}
					onScChange={(e) => {
						setOperator(e.target.value);
					}}
					choices={operators[attribute] || []}
					required
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
				<ScButton type="link" onClick={addLeaf}>
					{__('+ AND', 'surecart')}
				</ScButton>
			)}
		</ScCard>
	);
};
