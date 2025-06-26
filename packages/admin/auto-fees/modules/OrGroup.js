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
	ScPriceInput,
	ScSelect,
	ScCard,
	ScButton,
	ScEmpty,
	ScIcon,
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
		<ScCard hasTitleSlot={true}>
			<div
				css={css`
					display: flex;
					width: 100%;
					justify-content: flex-end;
				`}
			>
				<ScIcon
					name="trash"
					tabindex="0"
					onClick={removeRuleGroup}
					css={css`
						cursor: pointer;
						transition: color var(--sc-transition-medium)
							ease-in-out;
						color: var(--sc-color-gray-600);
						&:hover {
							color: var(--sc-color-danger-500);
						}
					`}
				/>
			</div>
			{ruleGroupsManager?.map(({ id }) => {
				return (
					<>
						{id > 1 && (
							<label
								css={css`
									display: block;
									text-align: center;
									color: var(--sc-color-gray-500);
								`}
							>
								{__('AND', 'surecart')}
							</label>
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
								setRuleGroupsManager(
									ruleGroupsManager.filter(
										(ruleGroup) => ruleGroup.id !== id
									)
								);
							}}
							totalRuleGroups={ruleGroupsManager?.length}
						/>
					</>
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
		</ScCard>
	);
};
