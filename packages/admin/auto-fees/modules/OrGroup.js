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

	const [andRuleGroupCount, setAndRuleGroupCount] = useState(1);

	return (
		<ScCard>
			{
				// render rule groups according to the andRuleGroupCount
				[...Array(andRuleGroupCount)].map((_, index) => (
					<>
						{index > 0 && (
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
							key={index}
							id={index}
							ruleSchema={ruleSchema}
							addRuleGroup={() =>
								setAndRuleGroupCount(andRuleGroupCount + 1)
							}
							totalRuleGroups={andRuleGroupCount}
						/>
					</>
				))
			}
			{totalRuleGroups === id + 1 && (
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
