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
import { addQueryArgs } from '@wordpress/url';

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

	const baseUrl = select(coreStore).getEntityConfig(
		'surecart',
		'rule-schema'
	)?.baseURL;

	const fetchRuleSchema = async () => {
		try {
			setLoadingRuleSchema(true);
			const response = await apiFetch({
				path: addQueryArgs(`${baseUrl}/${autoFee?.fee_target}`, {
					context: 'edit',
					t: Date.now(), // prevents cache.
				}),
			});

			setRuleSchema(response?.rule_schema);
			setLoadingRuleSchema(false);
		} catch (e) {
			console.error(e);
		}
	};

	const { rules } = autoFee;

	// Update rules whenever changes occur
	const updateRuleJson = (newRuleJson) => {
		onUpdate({ rules: newRuleJson });
	};

	useEffect(() => {
		if (!autoFee?.fee_target) {
			return;
		}
		fetchRuleSchema();
	}, [autoFee?.fee_target]);

	if (!rules?.conditions?.length) {
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
										type: 'group',
										combinator: 'or',
										conditions: [
											{
												type: 'group',
												combinator: 'and',
												conditions: [
													{
														type: 'condition',
														comparison_value: '',
														attribute_name: null,
														operator_label: null,
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
				{rules?.conditions?.map((group, groupIndex) => {
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
										JSON.stringify(rules)
									);
									newRuleJson.conditions.push({
										type: 'group',
										combinator: 'and',
										conditions: [
											{
												type: 'condition',
												comparison_value: '',
												attribute_name: null,
												operator_label: null,
											},
										],
									});
									updateRuleJson(newRuleJson);
								}}
								removeRuleGroup={() => {
									const newRuleJson = JSON.parse(
										JSON.stringify(rules)
									);
									newRuleJson.conditions =
										newRuleJson.conditions.filter(
											(_, index) => index !== groupIndex
										);
									updateRuleJson(newRuleJson);
								}}
								totalRuleGroups={rules?.conditions?.length}
								groupIndex={groupIndex}
								rules={rules}
								updateRuleJson={updateRuleJson}
							/>
						</div>
					);
				})}
			</ScFlex>
		</Box>
	);
};
