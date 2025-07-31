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
import { SCHEMA_ID } from '../utils/constants';

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
				path: `${baseUrl}/schema/${SCHEMA_ID}`,
			});
			setRuleSchema(response?.attributes);
			setLoadingRuleSchema(false);
		} catch (e) {
			console.error(e);
		}
	};

	const {
		rule_string,
		rule_json = {
			rule_string: '',
			schema_id: 'auto_fees__line_item',
			groups: [],
		},
	} = autoFee;

	// Update rule_json whenever changes occur
	const updateRuleJson = (newRuleJson) => {
		onUpdate({ rule_json: newRuleJson });
	};

	useEffect(() => {
		if (ruleSchema) {
			return;
		}
		fetchRuleSchema();
	}, [ruleSchema]);

	if (!rule_json?.groups?.length) {
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
									updateRuleJson({
										schema_id: SCHEMA_ID,
										groups: [
											{
												leaves: [
													{
														attribute_name: null,
														operator_label: null,
														comparison_value: '',
													},
												],
											},
										],
									});
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
				{__('Apply this auto fee to Line Items where ', 'surecart')}
			</label>
			<ScFlex
				flexDirection="column"
				css={css`
					--sc-flex-column-gap: 0;
				`}
			>
				{rule_json?.groups?.map((group, groupIndex) => {
					return (
						<div
							key={groupIndex}
							css={css`
								display: flex;
								flex-direction: column;
							`}
						>
							{groupIndex > 0 && (
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
								group={group}
								ruleSchema={ruleSchema}
								addRuleGroup={() => {
									const newRuleJson = JSON.parse(
										JSON.stringify(rule_json)
									);
									newRuleJson.groups.push({
										leaves: [
											{
												attribute_name: null,
												operator_label: null,
												comparison_value: '',
											},
										],
									});
									updateRuleJson(newRuleJson);
								}}
								removeRuleGroup={() => {
									const newRuleJson = JSON.parse(
										JSON.stringify(rule_json)
									);
									newRuleJson.groups =
										newRuleJson.groups.filter(
											(_, index) => index !== groupIndex
										);
									updateRuleJson(newRuleJson);
								}}
								totalRuleGroups={rule_json?.groups?.length}
								groupIndex={groupIndex}
								rule_json={rule_json}
								updateRuleJson={updateRuleJson}
							/>
						</div>
					);
				})}
			</ScFlex>
		</Box>
	);
};
