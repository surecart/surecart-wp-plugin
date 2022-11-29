import {
	ScButton,
	ScIcon,
	ScSelect,
	ScSwitch,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Box from '../../ui/Box';
import Filters from './filters/Filters';
import NewRestriction from './NewRestriction';

export default ({ loading, coupon, updateCoupon }) => {
	const [newDialog, setNewDialog] = useState(false);

	const hasRestrictions =
		coupon?.filter_price_ids?.length ||
		coupon?.filter_product_ids?.length ||
		coupon?.filter_customer_ids?.length ||
		coupon?.filter_product_group_ids?.length;

	return (
		<>
			<Box
				title={__('Restrictions', 'surecart')}
				loading={loading}
				footer={
					!!coupon?.filter_match_type && (
						<ScButton onClick={() => setNewDialog(true)}>
							<ScIcon name="plus" slot="prefix" />
							{__('Add A Restriction', 'surecart')}
						</ScButton>
					)
				}
			>
				<ScSwitch
					checked={!!coupon?.filter_match_type}
					onScChange={(e) =>
						updateCoupon({
							filter_match_type: e.target.checked ? 'all' : null,
						})
					}
				>
					{__('Restrict this coupon', 'surecart')}
				</ScSwitch>

				{!!coupon?.filter_match_type && (
					<>
						{!!hasRestrictions && (
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
										updateCoupon({
											filter_match_type: e.target.value,
										})
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
					</>
				)}
			</Box>
			{newDialog && (
				<NewRestriction
					coupon={coupon}
					updateCoupon={updateCoupon}
					onRequestClose={() => setNewDialog(false)}
				/>
			)}
		</>
	);
};
