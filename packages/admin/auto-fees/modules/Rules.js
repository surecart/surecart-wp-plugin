/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScCard,
	ScButton,
	ScEmpty,
	ScIcon,
	ScFlex,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import OrGroup from './OrGroup';
import { createEmptyOrGroup } from '../utils/ruleQueryUtils';

export default ({ autoFee = {}, onUpdate, loading }) => {
	const [ruleSchema, setRuleSchema] = useState(null);
	const [loadingRuleSchema, setLoadingRuleSchema] = useState(false);
	const [ruleGroupsManager, setRuleGroupsManager] = useState([]);

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
			setLoadingRuleSchema(false);
		} catch (e) {
			console.error(e);
		}
	};

	const { rule_string, rule_query = [] } = autoFee;
	console.log('Auto Fee Rule Query:', rule_query);

	// Initialize ruleGroupsManager based on existing rule_query
	useEffect(() => {
		if (rule_query.length > 0 && ruleGroupsManager.length === 0) {
			const initialGroups = rule_query.map((_, index) => ({
				id: index + 1,
			}));
			setRuleGroupsManager(initialGroups);
		}
	}, [rule_query, ruleGroupsManager.length]);

	// Update rule_query whenever changes occur
	const updateRuleQuery = (newRuleQuery) => {
		console.log('Updating rule_query:', newRuleQuery);
		onUpdate({ rule_query: newRuleQuery });
	};

	useEffect(() => {
		if (ruleSchema) {
			return;
		}
		fetchRuleSchema();
	}, [ruleSchema]);

	if (!ruleGroupsManager?.length) {
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
								onClick={() => {
									const newRuleGroups = [{ id: 1 }];
									setRuleGroupsManager(newRuleGroups);
									// Initialize rule_query with empty OR group
									updateRuleQuery([createEmptyOrGroup()]);
								}}
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
		<Box
			title={__('Auto Fee Conditions', 'surecart')}
			loading={loading || loadingRuleSchema}
		>
			<label
				css={css`
					display: block;
					font-size: 1em;
					margin-bottom: 10px;
				`}
			>
				{__('Apply this auto fee to Orders where ', 'surecart')}
			</label>
			<ScFlex
				flexDirection="column"
				css={css`
					--sc-flex-column-gap: 0;
				`}
			>
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
									{__('OR', 'surecart')}
								</ScButton>
							)}
							<OrGroup
								id={id}
								ruleSchema={ruleSchema}
								addRuleGroup={() => {
									const newRuleGroups = [
										...ruleGroupsManager,
										{ id: ruleGroupsManager?.length + 1 },
									];
									setRuleGroupsManager(newRuleGroups);
									// Add new empty OR group to rule_query
									const newRuleQuery = [
										...rule_query,
										createEmptyOrGroup(),
									];
									updateRuleQuery(newRuleQuery);
								}}
								removeRuleGroup={() => {
									const newRuleGroups =
										ruleGroupsManager.filter(
											(ruleGroup) => ruleGroup.id !== id
										);
									setRuleGroupsManager(newRuleGroups);
									// Remove corresponding OR group from rule_query
									const newRuleQuery = rule_query.filter(
										(_, index) => index !== id - 1
									);
									updateRuleQuery(newRuleQuery);
								}}
								totalRuleGroups={ruleGroupsManager?.length}
								orGroupIndex={id - 1}
								rule_query={rule_query}
								updateRuleQuery={updateRuleQuery}
							/>
						</div>
					);
				})}
			</ScFlex>
		</Box>
	);
};
