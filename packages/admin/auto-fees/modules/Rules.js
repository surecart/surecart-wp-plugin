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
	ScTag,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import OrGroup from './OrGroup';
import { TYPE_CHOICES } from '../utils/constants';
import { getCurrencyCode } from '../utils/helper';

/**
 * Checks if any condition in the rules has an order_type attribute.
 */
const hasOrderTypeCondition = (rules) => {
	return JSON.stringify(rules).includes('order_type');
};

// Extract default condition structure as constants
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

export default ({ autoFee = {}, onUpdate, loading }) => {
	const { rules, discount } = autoFee;

	const autoFeeAppliesTo = useMemo(
		() =>
			TYPE_CHOICES?.find(
				(choice) => choice.value === autoFee?.fee_target
			),
		[autoFee?.fee_target]
	);

	// Check if any order_type condition exists in the rules
	const showAllTransactionsNotice = useMemo(
		() => rules?.conditions?.length > 0 && !hasOrderTypeCondition(rules),
		[rules]
	);

	const updateRuleJson = useCallback(
		(newRuleJson) => {
			onUpdate({ rules: newRuleJson });
		},
		[onUpdate]
	);

	const handleAddInitialConditions = useCallback(() => {
		updateRuleJson(INITIAL_RULES);
	}, [updateRuleJson]);

	// No cloning needed - just create new object immutably
	const handleAddRuleGroup = useCallback(() => {
		updateRuleJson({
			...rules,
			conditions: [...rules.conditions, { ...DEFAULT_RULE_GROUP }],
		});
	}, [rules, updateRuleJson]);

	// No cloning needed - filter creates a new array
	const handleRemoveRuleGroup = useCallback(
		(groupIndex) => {
			updateRuleJson({
				...rules,
				conditions: rules.conditions.filter(
					(_, index) => index !== groupIndex
				),
			});
		},
		[rules, updateRuleJson]
	);

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
		<Box
			title={__('Conditions', 'surecart')}
			loading={loading}
			header_action={
				showAllTransactionsNotice && (
					<sc-popover style={{ '--panel-width': '300px', margin: '-10px 0' }}>
						<ScTag type="info" pill slot="trigger">
							<ScIcon name="info" slot="prefix"/>
							{__('All Transactions', 'surecart')}
						</ScTag>
						<span slot="title">
							{__('All Transactions', 'surecart')}
						</span>
						<sc-prose slot="content">
							<p>
							{__(
									'This dynamic price applies to all transactions, including initial checkouts, renewals, upgrades, and downgrades. Add an "Order Type" condition to limit when it applies.',
									'surecart'
								)}
							</p>
						</sc-prose>
						<ScButton
							slot="footer"
							type="link"
							target="_blank"
              style={{
                fontSize: '12px',
              }}
							href="https://surecart.com/docs/dynamic-pricing/#when-to-apply"
						>
							{__('Learn More', 'surecart')}{' '}
							<ScIcon name="external-link" slot="suffix" />
						</ScButton>
					</sc-popover>
				)
			}
		>
			<label
				css={css`
					display: block;
					font-size: 1em;
					margin-bottom: 10px;
					display: flex;
					align-items: center;
					gap: 0.25em;
				`}
			>
				{__('Apply a', 'surecart')}{' '}
				<ScTag type={'success'} pill>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.25em;
						`}
					>
						<ScIcon
							name={
								discount ? 'arrow-down-right' : 'arrow-up-right'
							}
							type={discount ? 'success' : 'danger'}
						/>
						{discount
							? __('Discount', 'surecart')
							: __('Fee', 'surecart')}
					</div>
				</ScTag>{' '}
				{__('to', 'surecart')}{' '}
				<ScTag type="info" pill>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ScIcon name={autoFeeAppliesTo?.icon} />
						{autoFeeAppliesTo?.label}
					</div>
				</ScTag>{' '}
				{__('where', 'surecart')}
			</label>

			<ScFlex
				flexDirection="column"
				css={css`
					--sc-flex-column-gap: 0;
				`}
			>
				{rules?.conditions?.map((group, groupIndex) => {
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
								currencyCode={getCurrencyCode(autoFee)}
							/>
						</div>
					);
				})}
			</ScFlex>
		</Box>
	);
};
