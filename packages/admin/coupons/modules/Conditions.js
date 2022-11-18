import {
	ScButton,
	ScEmpty,
	ScIcon,
	ScSelect,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Box from '../../ui/Box';
import Filters from './filters/Filters';
import NewCondition from './NewCondition';

export default ({ loading, coupon, updateCoupon }) => {
	const [newDialog, setNewDialog] = useState(false);

	const hasConditions =
		coupon?.filter_price_ids?.length ||
		coupon?.filter_product_ids?.length ||
		coupon?.filter_customer_ids?.length ||
		coupon?.filter_product_group_ids?.length;

	return (
		<Box
			title={__('Conditions', 'surecart')}
			loading={loading}
			footer={
				<ScButton onClick={() => setNewDialog(true)}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add A Condition', 'surecart')}
				</ScButton>
			}
		>
			{!!hasConditions && (
				<>
					<ScSelect
						label={__('Allow Coupon If', 'surecart')}
						value={coupon?.filter_match_type}
						choices={[
							{
								label: __(
									'All of these items are true.',
									'surecart'
								),
								value: 'all',
							},
							{
								label: __(
									'Any of these items are true.',
									'surecart'
								),
								value: 'any',
							},
							{
								label: __(
									'None of these items are true.',
									'surecart'
								),
								value: 'none',
							},
						]}
						onScChange={(e) =>
							updateCoupon({ filter_match_type: e.target.value })
						}
					/>
					<Filters
						label={__('Prices', 'surecart')}
						type="price_ids"
						coupon={coupon}
						updateCoupon={updateCoupon}
					/>
					<Filters
						label={__('Products', 'surecart')}
						type="product_ids"
						coupon={coupon}
						updateCoupon={updateCoupon}
					/>
					<Filters
						label={__('Customers', 'surecart')}
						type="customer_ids"
						coupon={coupon}
						updateCoupon={updateCoupon}
					/>
					<Filters
						label={__('Upgrade Groups', 'surecart')}
						type="product_group_ids"
						coupon={coupon}
						updateCoupon={updateCoupon}
					/>
				</>
			)}

			{newDialog && (
				<NewCondition
					coupon={coupon}
					updateCoupon={updateCoupon}
					onRequestClose={() => setNewDialog(false)}
				/>
			)}
		</Box>
	);
};
