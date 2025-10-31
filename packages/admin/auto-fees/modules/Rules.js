/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';

import {
	ScCard,
	ScButton,
	ScEmpty,
	ScIcon,
	ScFlex,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import OrGroup from './OrGroup';
import { TYPE_CHOICES } from '../utils/constants';

// Extract default condition structure as a constant
const DEFAULT_CONDITION = {
	type: 'condition',
	comparison_value: '',
	attribute_name: null,
	operator_label: null,
};

const DEFAULT_RULE_GROUP = {
	type: 'group',
	combinator: 'and',
	conditions: [DEFAULT_CONDITION],
};

const INITIAL_RULES = {
	type: 'group',
	combinator: 'or',
	conditions: [DEFAULT_RULE_GROUP],
};

/**
 * Deep clone utility function for rule objects
 */
const cloneRules = (rules) => {
	if (!rules) return null;
	return {
		...rules,
		conditions: rules.conditions?.map((group) => ({
			...group,
			conditions: group.conditions?.map((condition) => ({
				...condition,
			})),
		})),
	};
};

export default ({ autoFee = {}, onUpdate, loading }) => {
	const { rules } = autoFee;

	// Memoize the fee target label
	const autoFeeAppliesTo = useMemo(
		() =>
			TYPE_CHOICES?.find(
				(choice) => choice.value === autoFee?.fee_target
			),
		[autoFee?.fee_target]
	);

	// Update rules whenever changes occur
	const updateRuleJson = useCallback(
		(newRuleJson) => {
			onUpdate({ rules: newRuleJson });
		},
		[onUpdate]
	);

	// Handler to add initial conditions
	const handleAddInitialConditions = useCallback(() => {
		updateRuleJson(INITIAL_RULES);
	}, [updateRuleJson]);

	// Handler to add a new rule group
	const handleAddRuleGroup = useCallback(() => {
		const newRuleJson = cloneRules(rules);
		newRuleJson.conditions.push({ ...DEFAULT_RULE_GROUP });
		updateRuleJson(newRuleJson);
	}, [rules, updateRuleJson]);

	// Handler to remove a rule group
	const handleRemoveRuleGroup = useCallback(
		(groupIndex) => {
			const newRuleJson = cloneRules(rules);
			newRuleJson.conditions = newRuleJson.conditions.filter(
				(_, index) => index !== groupIndex
			);
			updateRuleJson(newRuleJson);
		},
		[rules, updateRuleJson]
	);

	// Empty state
	if (!rules?.conditions?.length) {
		return (
			<Box title={__('Conditions', 'surecart')} loading={loading}>
				<ScCard>
					<ScEmpty icon="sliders">
						{__(
							'To get started, add some conditions for this dynamic price.',
							'surecart'
						)}
						<div>
							<ScButton onClick={handleAddInitialConditions}>
								<ScIcon name="plus" slot="prefix" />
								{__('Add Conditions', 'surecart')}
							</ScButton>
						</div>
					</ScEmpty>
				</ScCard>
			</Box>
		);
	}

	return (
		<Box title={__('Conditions', 'surecart')} loading={loading}>
			<label
				css={css`
					display: block;
					font-size: 1em;
					margin-bottom: 10px;
				`}
			>
				{/* Better i18n: use sprintf-style formatting or separate the dynamic part */}
				{__('Apply this dynamic price to', 'surecart')}{' '}
				<strong>{autoFeeAppliesTo?.label}</strong>{' '}
				{__('where', 'surecart')}
			</label>
			<ScFlex
				flexDirection="column"
				css={css`
					--sc-flex-column-gap: 0;
				`}
			>
				{rules?.conditions?.map((group, groupIndex) => {
					// Use a more stable key if available (e.g., group.id)
					const groupKey = group.id || `group-${groupIndex}`;

					return (
						<div
							key={groupKey}
							css={css`
								display: flex;
								flex-direction: column;
							`}
						>
							{groupIndex > 0 && (
								<ScButton
									css={css`
										pointer-events: none;
										margin: 1em auto;
									`}
									pill
									type="default"
									size="small"
								>
									{__('OR', 'surecart')}
								</ScButton>
							)}
							<OrGroup
								group={group}
								addRuleGroup={handleAddRuleGroup}
								feeTarget={autoFee?.fee_target}
								removeRuleGroup={() =>
									handleRemoveRuleGroup(groupIndex)
								}
								totalRuleGroups={rules?.conditions?.length}
								groupIndex={groupIndex}
								rules={rules}
								updateRuleJson={updateRuleJson}
							/>
						</div>
					);
				})}
			</ScFlex>
		</Box>
	);
};
