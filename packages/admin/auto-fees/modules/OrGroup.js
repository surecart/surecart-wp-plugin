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
	ScToggle,
	ScButton,
	ScIcon,
	ScSkeleton,
} from '@surecart/components-react';
import AndGroup from './AndGroup';
import { createEmptyAndRule } from '../utils/ruleQueryUtils';

export default ({
	ruleSchema = [],
	addRuleGroup,
	removeRuleGroup,
	id,
	totalRuleGroups,
	loading,
	orGroupIndex,
	rule_query,
	updateRuleQuery,
}) => {
	if (loading || !ruleSchema?.length) {
		return (
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 1.5em;
					margin-bottom: 2em;
				`}
			>
				<ScSkeleton style={{ width: '45%' }}></ScSkeleton>
				<ScSkeleton style={{ width: '65%' }}></ScSkeleton>
			</div>
		);
	}

	const [ruleGroupsManager, setRuleGroupsManager] = useState([{ id: 1 }]);

	return (
		<ScToggle
			open
			css={css`
				position: relative;
			`}
			showIcon={true}
		>
			<ScButton
				circle
				css={css`
					--sc-input-height-medium: 30px;
					position: absolute;
					top: -20px;
					right: -12px;
				`}
				onClick={removeRuleGroup}
			>
				<ScIcon name="trash" />
			</ScButton>
			{ruleGroupsManager?.map(({ id }) => {
				return (
					<div
						key={id}
						css={css`
							display: flex;
							flex-direction: column;
						`}
					>
						{id > 1 && (
							<ScButton
								css={css`
									pointer-events: none;
									margin: 1em auto;
								`}
								pill
								type="default"
								size="small"
							>
								{__('AND', 'surecart')}
							</ScButton>
						)}
						<AndGroup
							key={id}
							id={id}
							ruleSchema={ruleSchema}
							addRuleGroup={() => {
								const newRuleGroups = [
									...ruleGroupsManager,
									{ id: ruleGroupsManager?.length + 1 },
								];
								setRuleGroupsManager(newRuleGroups);
								// Add new empty AND condition to current OR group
								const newRuleQuery = [...rule_query];
								if (!newRuleQuery[orGroupIndex]) {
									newRuleQuery[orGroupIndex] = [];
								}
								newRuleQuery[orGroupIndex].push(
									createEmptyAndRule()
								);
								updateRuleQuery(newRuleQuery);
							}}
							removeRuleGroup={() => {
								if (ruleGroupsManager.length === 1) {
									removeRuleGroup();
									return;
								}
								const newRuleGroups = ruleGroupsManager.filter(
									(ruleGroup) => ruleGroup.id !== id
								);
								setRuleGroupsManager(newRuleGroups);
								// Remove corresponding AND condition from rule_query
								const newRuleQuery = [...rule_query];
								if (newRuleQuery[orGroupIndex]) {
									newRuleQuery[orGroupIndex] = newRuleQuery[
										orGroupIndex
									].filter((_, index) => index !== id - 1);
								}
								updateRuleQuery(newRuleQuery);
							}}
							totalRuleGroups={ruleGroupsManager?.length}
							andGroupIndex={id - 1}
							orGroupIndex={orGroupIndex}
							rule_query={rule_query}
							updateRuleQuery={updateRuleQuery}
						/>
					</div>
				);
			})}
			{totalRuleGroups === id && (
				<ScButton
					type="link"
					css={css`
						text-align: left;
						--sc-button-link-color: #388051;
					`}
					onClick={addRuleGroup}
				>
					{__('+ Add OR Group', 'surecart')}
				</ScButton>
			)}
		</ScToggle>
	);
};
