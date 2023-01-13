/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
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
	const [activeRuleGroup, setActiveRuleGroup] = useState(0);

	console.log('rule_groups');
	console.log(rule_groups);
	console.log('draftRuleGroups');
	console.log(draftRuleGroups);

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

	const showRules = (groupIndex) =>
		setActiveRuleGroup(activeRuleGroup !== groupIndex ? groupIndex : -1);

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
			<form className="sc-rules-group-form" onSubmit={handleFormSubmit}>
				{draftRuleGroups.map(({ group_id, rules }, groupIndex) => {
					const isActiveGroup = activeRuleGroup === groupIndex;
					return (
						<div
							className="sc-rules-page--group_wrapper"
							key={group_id}
						>
							<div
								className="sc-rules--group"
								css={css`
									padding: 15px;
									background-color: #fafafa;
									border: 1px dashed #fafafa;
								`}
							>
								<input
									type="hidden"
									name={`sc-form-rules[${groupIndex}][group_id]`}
									value={group_id}
								/>

								<div
									className="sc-rules--redirection-step"
									css={css`
										display: flex;
										justify-content: space-between;
									`}
								>
									<div className="sc-rules--group_header__left">
										{renderRuleTitle(rules)}
									</div>
									<div className="sc-rules--group_header">
										<span className="sc-rules--group_id">
											{__('ID - ', 'surecart')}
											{group_id}
										</span>
										<span
											className={`dashicons ${
												isActiveGroup
													? 'dashicons-arrow-up'
													: 'dashicons-arrow-down'
											}`}
											onClick={() => {
												showRules(groupIndex);
											}}
										></span>
									</div>
								</div>
								<div
									id={`sc-rules--group-${group_id}`}
									className={!isActiveGroup && 'hidden'}
								>
									<div
										className="sc-rules--group_rules--wrapper"
										css={css`
											margin: 15px 0;
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

									<div className="sc-rules--add-rule__repeater">
										<div
											className="sc-button sc-button--secondary button"
											onClick={(e) => {
												addNewCondition(groupIndex);
											}}
										>
											{__('Add Condition', 'surecart')}
										</div>
									</div>
								</div>
							</div>
							<div
								className="sc-rules-page--group_wrapper__footer"
								css={css`
									margin: 20px 0 0;
								`}
							>
								{parseInt(groupIndex) + 1 <
									draftRuleGroups.length && (
									<div
										className="sc-rules--or-group"
										css={css`
											padding: 4px 6px;
											border: 1px solid #d4d4d4;
											margin: 15px auto;
											width: 48px;
											text-align: center;
										`}
									>
										<span className="sc-rules--or_group__text">
											{__('OR', 'surecart')}
										</span>
									</div>
								)}

								{parseInt(groupIndex) + 1 ===
									draftRuleGroups.length && (
									<div className="sc-rules--or_group__button">
										<span
											className="sc-rules--or_group_button or-button sc-button sc-button--secondary button"
											onClick={addNewGroup}
										>
											{__('Add Rule Group', 'surecart')}
										</span>
									</div>
								)}
							</div>
						</div>
					);
				})}
				<div
					className="sc-rules-page--footer"
					css={css`
						display: flex;
						justify-content: flex-end;
						margin-top: -33px;
					`}
				>
					<Button variant="secondary" onClick={closeModal}>
						{__('Cancel', 'surecart')}
					</Button>
					<Button
						variant="primary"
						type="submit"
						css={css`
							margin-left: 15px;
						`}
					>
						{__('Save', 'surecart')}
					</Button>
				</div>
			</form>
		</>
	);
};

export default Rules;
