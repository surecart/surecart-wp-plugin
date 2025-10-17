/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

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
	addRuleGroup,
	removeRuleGroup,
	totalRuleGroups,
	loading,
	groupIndex,
	rules,
	updateRuleJson,
	group,
	feeTarget,
}) => {
	if (loading) {
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
		return (group?.conditions || [])
			.filter((leaf) => leaf?.attribute_name)
			.map((leaf) => attributeLabels?.[leaf?.attribute_name])
			.filter(Boolean)
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
			{group?.conditions?.map((leaf, leafIndex) => {
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
							leaf={leaf}
							addLeaf={() => {
								const newRuleJson = JSON.parse(
									JSON.stringify(rules)
								);

								newRuleJson.conditions[
									groupIndex
								].conditions.push({
									type: 'condition',
									operator_label: null,
									comparison_value: '',
									attribute_name: null,
								});
								updateRuleJson(newRuleJson);
							}}
							removeLeaf={() => {
								// if there's only one leaf, remove the entire group
								if (group?.conditions?.length === 1) {
									removeRuleGroup();
									return;
								}

								const newRuleJson = JSON.parse(
									JSON.stringify(rules)
								);
								newRuleJson.conditions[groupIndex].conditions =
									newRuleJson.conditions[
										groupIndex
									].conditions.filter(
										(_, index) => index !== leafIndex
									);
								updateRuleJson(newRuleJson);
							}}
							feeTarget={feeTarget}
							totalLeaves={group?.conditions?.length}
							leafIndex={leafIndex}
							groupIndex={groupIndex}
							rules={rules}
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
