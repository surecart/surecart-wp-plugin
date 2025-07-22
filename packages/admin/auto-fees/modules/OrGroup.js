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
import { attributeLabels } from '../utils/labelTranslations';

export default ({
	ruleSchema = [],
	addRuleGroup,
	removeRuleGroup,
	totalRuleGroups,
	loading,
	groupIndex,
	rule_json,
	updateRuleJson,
	group,
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

	const renderRuleTitle = () => {
		return (group?.leaves || [])
			?.map((leaf) => {
				if (!leaf?.attribute_name) {
					return;
				}

				return attributeLabels?.[leaf?.attribute_name];
			})
			.join(', ');
	};

	return (
		<ScToggle
			open
			css={css`
				position: relative;
			`}
			showIcon={true}
			summary={renderRuleTitle()}
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
			{group?.leaves?.map((leaf, leafIndex) => {
				return (
					<div
						key={leafIndex}
						css={css`
							display: flex;
							flex-direction: column;
						`}
					>
						{leafIndex > 0 && (
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
							key={leafIndex}
							ruleSchema={ruleSchema}
							leaf={leaf}
							addLeaf={() => {
								const newRuleJson = JSON.parse(
									JSON.stringify(rule_json)
								);
								newRuleJson.rule_string.groups[
									groupIndex
								].leaves.push({
									attribute_name: null,
									operator_label: null,
									comparison_value: '',
								});
								updateRuleJson(newRuleJson);
							}}
							removeLeaf={() => {
								// if there's only one leaf, remove the entire group
								if (group?.leaves?.length === 1) {
									removeRuleGroup();
									return;
								}

								const newRuleJson = JSON.parse(
									JSON.stringify(rule_json)
								);
								newRuleJson.rule_string.groups[
									groupIndex
								].leaves = newRuleJson.rule_string.groups[
									groupIndex
								].leaves.filter(
									(_, index) => index !== leafIndex
								);
								updateRuleJson(newRuleJson);
							}}
							totalLeaves={group?.leaves?.length}
							leafIndex={leafIndex}
							groupIndex={groupIndex}
							rule_json={rule_json}
							updateRuleJson={updateRuleJson}
						/>
					</div>
				);
			})}
			{totalRuleGroups === groupIndex + 1 && (
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
