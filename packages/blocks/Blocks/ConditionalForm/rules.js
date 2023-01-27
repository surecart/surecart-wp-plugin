/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScIcon, ScToggle } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Conditions from './conditions';
import translations from './translations';

const Rules = ({ attributes, setAttributes, closeModal }) => {
	const { rule_groups } = attributes;

	const getInitialGroups = () => {
		let defaultData = [
			{
				group_id: Math.random().toString(36).substring(2, 5),
				rules: [
					{
						condition: 'cart_item',
						operator: 'any',
						value: '',
					},
				],
			},
		];

		// Deep clone hack.
		let rgData =
			rule_groups?.length > 0
				? JSON.parse(JSON.stringify(rule_groups))
				: defaultData;

		return rgData;
	};

	const [draftRuleGroups, setDraftRuleGroups] = useState(getInitialGroups());

	const updateRuleGroupData = (data) => {
		setDraftRuleGroups([...data]);
	};

	const addConditionToRuleGroup = (groupIndex, newCondition) => {
		if (draftRuleGroups[groupIndex]?.rules) {
			draftRuleGroups[groupIndex].rules.push(newCondition);
			setDraftRuleGroups([...draftRuleGroups]);
		}
	};

	const removeConditionFromRuleGroup = (groupIndex, conditionIndex) => {
		const newGroupData = draftRuleGroups.filter((group, i) => {
			if (i === groupIndex) {
				group.rules = group.rules.filter((_, j) => {
					if (j === conditionIndex) {
						return false;
					}
					return true;
				});

				if (group.rules.length === 0) {
					return false;
				}
			}
			return true;
		});

		setDraftRuleGroups([...newGroupData]);
	};

	const updateConditionInRuleGroup = (
		groupIndex,
		conditionIndex,
		currentValue
	) => {
		let savedRule = draftRuleGroups[groupIndex]['rules'][conditionIndex];

		savedRule.condition = currentValue;
		savedRule.value = '';
		savedRule.operator = 'any';

		if ('cart_total' === currentValue) {
			savedRule.operator = '==';
		}

		draftRuleGroups[groupIndex]['rules'][conditionIndex] = savedRule;

		setDraftRuleGroups([...draftRuleGroups]);
	};

	const updateConditionOptionInRuleGroup = (
		groupIndex,
		conditionIndex,
		currentValue,
		optionName
	) => {
		draftRuleGroups[groupIndex]['rules'][conditionIndex][optionName] =
			currentValue;

		setDraftRuleGroups([...draftRuleGroups]);
	};

	const addNewCondition = (groupIndex) => {
		const newCondition = {
			condition: 'cart_item',
			operator: 'any',
			value: '',
		};

		addConditionToRuleGroup(groupIndex, newCondition);
	};

	const addNewGroup = () => {
		updateRuleGroupData([
			...draftRuleGroups,
			{
				group_id: Math.random().toString(36).substring(2, 5),
				rules: [
					{
						condition: 'cart_item',
						operator: 'any',
						value: '',
					},
				],
			},
		]);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setAttributes({ rule_groups: draftRuleGroups });
		closeModal();
	};

	const renderRuleTitle = (rules) => {
		return (rules || [])
			.map((rule) => {
				return translations?.[rule?.condition];
			})
			.join(', ');
	};

	return (
		<>
			<form
				onSubmit={handleFormSubmit}
				style={{
					'--sc-color-primary-500': 'var(--wp-admin-theme-color)',
					'--sc-focus-ring-color-primary':
						'var(--wp-admin-theme-color)',
					'--sc-input-border-color-focus':
						'var(--wp-admin-theme-color)',
				}}
			>
				{draftRuleGroups.map(({ group_id, rules }, groupIndex) => {
					return (
						<div key={group_id}>
							<ScToggle
								shady
								summary={renderRuleTitle(rules)}
								open
							>
								<div
									css={css`
										margin-bottom: 15px;
									`}
								>
									{rules.length !== 0 && (
										<Conditions
											rules={rules}
											groupIndex={groupIndex}
											groupsLength={
												draftRuleGroups.length
											}
											removeConditionFromRuleGroup={(
												conditionIndex
											) =>
												removeConditionFromRuleGroup(
													groupIndex,
													conditionIndex
												)
											}
											updateConditionInRuleGroup={(
												conditionIndex,
												currentValue
											) => {
												updateConditionInRuleGroup(
													groupIndex,
													conditionIndex,
													currentValue
												);
											}}
											updateConditionOptionInRuleGroup={(
												conditionIndex,
												currentValue,
												optionName
											) => {
												updateConditionOptionInRuleGroup(
													groupIndex,
													conditionIndex,
													currentValue,
													optionName
												);
											}}
										/>
									)}
								</div>

								<div
									css={css`
										text-align: center;
									`}
								>
									<ScButton
										type="link"
										onClick={() =>
											addNewCondition(groupIndex)
										}
									>
										<ScIcon name="plus" slot="prefix" />
										{__('AND', 'surecart')}
									</ScButton>
								</div>
							</ScToggle>

							{parseInt(groupIndex) + 1 <
							draftRuleGroups.length ? (
								<div
									css={css`
										text-align: center;
										margin: 25px auto;
									`}
								>
									<ScButton
										css={css`
											pointer-events: none;
										`}
										pill
										type="default"
										size="small"
									>
										{__('OR', 'surecart')}
									</ScButton>
								</div>
							) : (
								<div
									css={css`
										margin: 15px 0 0;
										text-align: center;
									`}
								>
									<ScButton type="link" onClick={addNewGroup}>
										<ScIcon name="plus" slot="prefix" />
										{__('OR', 'surecart')}
									</ScButton>
								</div>
							)}
						</div>
					);
				})}
				<div
					css={css`
						display: flex;
						justify-content: flex-end;
					`}
				>
					<ScButton variant="secondary" onClick={closeModal}>
						{__('Cancel', 'surecart')}
					</ScButton>
					<ScButton
						type="primary"
						submit={true}
						css={css`
							margin-left: 15px;
						`}
					>
						{__('Set Rules', 'surecart')}
					</ScButton>
				</div>
			</form>
		</>
	);
};

export default Rules;
