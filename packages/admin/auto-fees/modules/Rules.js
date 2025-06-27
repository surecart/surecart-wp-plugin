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
} from '@surecart/components-react';
import Box from '../../ui/Box';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';

import apiFetch from '@wordpress/api-fetch';

import OrGroup from './OrGroup';

export default ({ autoFee = {}, onUpdate, loading }) => {
	if (!loading && !autoFee?.id) {
		return null;
	}

	const [ruleSchema, setRuleSchema] = useState(null);
	const [loadingRuleSchema, setLoadingRuleSchema] = useState(false);
	const [ruleGroupsManager, setRuleGroupsManager] = useState([{ id: 1 }]);

	const baseUrl = select(coreStore).getEntityConfig(
		'surecart',
		'auto-fee-rule-schema'
	)?.baseURL;

	const fetchRuleSchema = async () => {
		try {
			setLoadingRuleSchema(true);
			const response = await apiFetch({
				path: `${baseUrl}`,
			});
			setRuleSchema(response?.data);
			setRuleGroupsManager([{ id: 1 }]);
			setLoadingRuleSchema(false);
		} catch (e) {
			console.error(e);
		}
	};

	const { rule_string } = autoFee;

	if (!ruleSchema || !ruleGroupsManager?.length) {
		return (
			<Box
				title={__('Auto Fee Conditions', 'surecart')}
				loading={loading}
			>
				<ScCard>
					<ScEmpty icon="settings">
						{__(
							'No conditions have been set for this auto fee.',
							'surecart'
						)}
						<div>
							<ScButton
								onClick={() => fetchRuleSchema()}
								loading={loadingRuleSchema}
							>
								<ScIcon name="plus" slot="prefix" />
								{__('Add Conditions', 'surecart')}
							</ScButton>
						</div>
					</ScEmpty>
				</ScCard>
			</Box>
		);
	}

	return (
		<Box title={__('Auto Fee Conditions', 'surecart')} loading={loading}>
			<label
				css={css`
					display: block;
					font-size: 14px;
					font-weight: 500;
					margin-bottom: 10px;
				`}
			>
				{__('Apply this auto fee to Orders where: ', 'surecart')}
			</label>
			{ruleGroupsManager?.map(({ id }) => {
				return (
					<div key={id}>
						{id > 1 && (
							<label
								css={css`
									display: block;
									text-align: center;
									color: var(--sc-color-gray-500);
								`}
							>
								{__('OR', 'surecart')}
							</label>
						)}
						<OrGroup
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
					</div>
				);
			})}
		</Box>
	);
};
