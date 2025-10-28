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
	ScCard,
	ScButton,
	ScEmpty,
	ScIcon,
	ScFlex,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import OrGroup from './OrGroup';
import { TYPE_CHOICES } from '../utils/constants';

export default ({ autoFee = {}, onUpdate, loading }) => {
	const { rules } = autoFee;

	// Update rules whenever changes occur
	const updateRuleJson = (newRuleJson) => {
		onUpdate({ rules: newRuleJson });
	};

	if (!rules?.conditions?.length) {
		return (
			<Box title={__('Conditions', 'surecart')} loading={loading}>
				<ScCard>
					<ScEmpty icon="settings">
						{__(
							'No conditions have been set for this dynamic price.',
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

	const autoFeeAppliesTo = TYPE_CHOICES?.find(
		(choice) => choice.value === autoFee?.fee_target
	);

	return (
		<Box title={__('Conditions', 'surecart')} loading={loading}>
			<label
				css={css`
					display: block;
					font-size: 1em;
					margin-bottom: 10px;
				`}
			>
				{__(
					`Apply this dynamic price to ${autoFeeAppliesTo?.label} where `,
					'surecart'
				)}
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
								feeTarget={autoFee?.fee_target}
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
