/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScEmpty,
	ScIcon,
	ScRadio,
	ScRadioGroup,
	ScSelect,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Filters from '../../components/filters/Filters';
import Box from '../../ui/Box';
import NewCondition from './NewCondition';

export default ({ loading, funnel, updateFunnel }) => {
	const [newDialog, setNewDialog] = useState(false);

	const shouldMatch = !!funnel?.filter_match_type;

	const empty = !(
		funnel?.filter_price_ids?.length ||
		funnel?.filter_product_ids?.length ||
		funnel?.filter_product_group_ids?.length
	);

	return (
		<Box
			title={__('Display Conditions', 'surecart')}
			loading={loading}
			footer={
				shouldMatch &&
				!empty && (
					<ScButton onClick={() => setNewDialog(true)}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add A Condition', 'surecart')}
					</ScButton>
				)
			}
		>
			<ScRadioGroup>
				<div
					css={css`
						display: grid;
						gap: 1em;
						--sc-input-font-weight: var(--sc-font-weight-semibold);
					`}
				>
					<ScRadio
						checked={!funnel?.filter_match_type}
						value=""
						onClick={() =>
							updateFunnel({
								filter_match_type: null,
							})
						}
					>
						{__('All purchases', 'surecart')}
						<span slot="description">
							{__(
								'Show this upsell offer on all purchases.',
								'surecart'
							)}
						</span>
					</ScRadio>
					<ScRadio
						checked={!!funnel?.filter_match_type}
						value="all"
						onClick={() =>
							updateFunnel({
								filter_match_type: 'all',
							})
						}
					>
						{__('Specific purchases', 'surecart')}
						<span slot="description">
							{__(
								'Select conditions to show this upsell.',
								'surecart'
							)}
						</span>
					</ScRadio>
				</div>
			</ScRadioGroup>

			{shouldMatch && (
				<>
					{!empty && (
						<ScSelect
							label={__('Show Upsell Offer If', 'surecart')}
							value={funnel?.filter_match_type}
							choices={[
								{
									label: __(
										'All of these items are in the cart.',
										'surecart'
									),
									value: 'all',
								},
								{
									label: __(
										'Any of these items are in the cart.',
										'surecart'
									),
									value: 'any',
								},
								{
									label: __(
										'None of these items are in the cart.',
										'surecart'
									),
									value: 'none',
								},
							]}
							onScChange={(e) =>
								updateFunnel({
									filter_match_type: e.target.value,
								})
							}
						/>
					)}

					<Filters
						label={__('Prices', 'surecart')}
						type="filter_price_ids"
						item={funnel}
						updateItem={updateFunnel}
					/>

					<Filters
						label={__('Products', 'surecart')}
						type="filter_product_ids"
						item={funnel}
						updateItem={updateFunnel}
					/>

					<Filters
						label={__('Customers', 'surecart')}
						type="filter_customer_ids"
						item={funnel}
						updateItem={updateFunnel}
					/>

					{empty && (
						<ScEmpty icon="zap">
							{__(
								'Add some conditions to display this upsell funnel.',
								'surecart'
							)}
							<ScButton onClick={() => setNewDialog(true)}>
								<ScIcon name="plus" slot="prefix" />
								{__('Add A Condition', 'surecart')}
							</ScButton>
						</ScEmpty>
					)}
				</>
			)}

			{newDialog && (
				<NewCondition
					funnel={funnel}
					updateFunnel={updateFunnel}
					onRequestClose={() => setNewDialog(false)}
				/>
			)}
		</Box>
	);
};
