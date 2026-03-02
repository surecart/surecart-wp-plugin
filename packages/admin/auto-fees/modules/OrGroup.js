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
import { attributeLabels } from '../utils/constants';

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
	currencyCode,
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
				<ScSkeleton style={{ width: '45%' }} />
				<ScSkeleton style={{ width: '65%' }} />
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

	const handleAddLeaf = () => {
		const newRuleJson = structuredClone(rules);

		newRuleJson.conditions[groupIndex].conditions.push({
			type: 'condition',
			operator_label: null,
			comparison_value: '',
			attribute_name: null,
		});
		updateRuleJson(newRuleJson);
	};

	const handleRemoveLeaf = (leafIndex) => {
		// If there's only one leaf, remove the entire group
		if (group?.conditions?.length === 1) {
			removeRuleGroup();
			return;
		}

		const newRuleJson = structuredClone(rules);
		newRuleJson.conditions[groupIndex].conditions = newRuleJson.conditions[
			groupIndex
		].conditions.filter((_, index) => index !== leafIndex);
		updateRuleJson(newRuleJson);
	};

	const isLastGroup = totalRuleGroups === groupIndex + 1;

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
				aria-label={__('Remove rule group', 'surecart')}
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
								aria-label={__('AND operator', 'surecart')}
							>
								{__('AND', 'surecart')}
							</ScButton>
						)}
						<AndGroup
							leaf={leaf}
							addLeaf={handleAddLeaf}
							removeLeaf={() => handleRemoveLeaf(leafIndex)}
							feeTarget={feeTarget}
							totalLeaves={group?.conditions?.length}
							leafIndex={leafIndex}
							groupIndex={groupIndex}
							rules={rules}
							updateRuleJson={updateRuleJson}
							currencyCode={currencyCode}
						/>
					</div>
				);
			})}
			{isLastGroup && (
				<ScButton
					type="link"
					onClick={addRuleGroup}
					css={css`
						margin: 1em auto 0;
					`}
				>
					{__('+ OR', 'surecart')}
				</ScButton>
			)}
		</ScToggle>
	);
};
