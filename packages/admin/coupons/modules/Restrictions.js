import {
	ScButton,
	ScIcon,
	ScSelect,
	ScSwitch,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Filters from '../../components/filters/Filters';
import Box from '../../ui/Box';
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
								<Filters
									label={__('Prices', 'surecart')}
									type="filter_price_ids"
									item={coupon}
									updateItem={updateCoupon}
								/>

								<Filters
									label={__('Products', 'surecart')}
									type="filter_product_ids"
									item={coupon}
									updateItem={updateCoupon}
								/>

								<Filters
									label={__('Customers', 'surecart')}
									type="filter_customer_ids"
									item={coupon}
									updateItem={updateCoupon}
								/>

								<ScSelect
									label={__('Allow Coupon', 'surecart')}
									value={coupon?.filter_match_type}
									choices={[
										{
											label: __(
												'If all of these conditions are true',
												'surecart'
											),
											value: 'all',
										},
										{
											label: __(
												'If any of these conditions are true',
												'surecart'
											),
											value: 'any',
										},
										{
											label: __(
												'If none of these conditions are true',
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
