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
	ScInput,
	ScToggle,
	ScSelect,
	ScCard,
	ScButton,
	ScEmpty,
	ScIcon,
	ScFlex,
	ScSkeleton,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';

import apiFetch from '@wordpress/api-fetch';

import AndGroup from './AndGroup';

export default ({
	ruleSchema = [],
	addRuleGroup,
	removeRuleGroup,
	id,
	totalRuleGroups,
	loading,
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
							addRuleGroup={() =>
								setRuleGroupsManager([
									...ruleGroupsManager,
									{ id: ruleGroupsManager?.length + 1 },
								])
							}
							removeRuleGroup={() => {
								if (ruleGroupsManager.length === 1) {
									removeRuleGroup();
									return;
								}
								setRuleGroupsManager(
									ruleGroupsManager.filter(
										(ruleGroup) => ruleGroup.id !== id
									)
								);
							}}
							totalRuleGroups={ruleGroupsManager?.length}
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
