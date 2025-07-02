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

	const { rule_string } = autoFee;

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
								onClick={() =>
									setRuleGroupsManager([{ id: 1 }])
								}
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
			</ScFlex>
		</Box>
	);
};
