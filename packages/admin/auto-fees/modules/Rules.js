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

	const baseUrl = select(coreStore).getEntityConfig(
		'surecart',
		'rule-string'
	)?.baseURL;

	const fetchRuleSchema = async () => {
		try {
			setLoadingRuleSchema(true);
			const response = await apiFetch({
				path: `${baseUrl}/schema/auto_fees__checkout`,
			});
			setRuleSchema(response?.attributes);
			setLoadingRuleSchema(false);
		} catch (e) {
			console.error(e);
		}
	};

	const { rule_string, rule_query = [] } = autoFee;

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

	if (!rule_query?.length) {
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
				{rule_query?.map((orGroup, orGroupIndex) => {
					return (
						<div
							key={orGroupIndex}
							css={css`
								display: flex;
								flex-direction: column;
							`}
						>
							{orGroupIndex > 0 && (
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
								orGroup={orGroup}
								ruleSchema={ruleSchema}
								addRuleGroup={() => {
									const newRuleQuery = [
										...rule_query,
										createEmptyOrGroup(),
									];
									updateRuleQuery(newRuleQuery);
								}}
								removeRuleGroup={() => {
									const newRuleQuery = rule_query.filter(
										(_, index) => index !== orGroupIndex
									);
									updateRuleQuery(newRuleQuery);
								}}
								totalRuleGroups={rule_query?.length}
								orGroupIndex={orGroupIndex}
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
