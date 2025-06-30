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
	ScFlex,
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

	useEffect(() => {
		setRuleGroupsManager([{ id: 1 }]);
	}, []);

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
					font-size: 14px;
					font-weight: 500;
					margin-bottom: 10px;
				`}
			>
				{__('Apply this auto fee to Orders where: ', 'surecart')}
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
