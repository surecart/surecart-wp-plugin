import {
	ScButton,
	ScEmpty,
	ScIcon,
	ScSelect,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Filters from '../../components/filters/Filters';
import Box from '../../ui/Box';
import NewCondition from './NewCondition';

export default ({ loading, funnel, updateFunnel }) => {
	const [newDialog, setNewDialog] = useState(false);

	const hasConditions =
		funnel?.filter_price_ids?.length ||
		funnel?.filter_product_ids?.length ||
		funnel?.filter_product_group_ids?.length;

	return (
		<Box
			title={__('Display Conditions', 'surecart')}
			loading={loading}
			footer={
				<ScButton onClick={() => setNewDialog(true)}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add A Condition', 'surecart')}
				</ScButton>
			}
		>
			{hasConditions ? (
				<>
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
							updateFunnel({ filter_match_type: e.target.value })
						}
					/>
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
				</>
			) : (
				<ScEmpty icon="zap">
					{__(
						'Add some conditions to display this funnel.',
						'surecart'
					)}
				</ScEmpty>
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
