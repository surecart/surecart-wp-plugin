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
	totalRuleGroups,
	loading,
	orGroupIndex,
	rule_query,
	updateRuleQuery,
	orGroup,
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
			{orGroup?.map((_, andGroupIndex) => {
				return (
					<div
						key={andGroupIndex}
						css={css`
							display: flex;
							flex-direction: column;
						`}
					>
						{andGroupIndex > 0 && (
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
							key={andGroupIndex}
							ruleSchema={ruleSchema}
							addRuleGroup={() => {
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
								const newRuleQuery = [...rule_query];
								if (newRuleQuery[orGroupIndex]) {
									newRuleQuery[orGroupIndex] = newRuleQuery[
										orGroupIndex
									].filter(
										(_, index) => index !== andGroupIndex
									);
								}
								updateRuleQuery(newRuleQuery);
							}}
							totalRuleGroups={orGroup?.length}
							andGroupIndex={andGroupIndex}
							orGroupIndex={orGroupIndex}
							rule_query={rule_query}
							updateRuleQuery={updateRuleQuery}
						/>
					</div>
				);
			})}
			{totalRuleGroups === orGroupIndex + 1 && (
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
