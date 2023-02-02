import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedListRow,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import Box from '../../../ui/Box';
import { __ } from '@wordpress/i18n';

export default ({ id, onRemoveCoupon, loading, coupon }) => {
	const { selectedCoupon, couponLoading } = useSelect(
		(select) => {
			const queryArgs = ['surecart', 'coupon', id];

			return {
				coupon: select(coreStore).getEntityRecord(...queryArgs),
				couponLoading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[id]
	);
	return (
		<Box
			title={__('Coupon', 'surecart')}
			loading={loading || couponLoading}
		>
			<ScStackedListRow>
				{coupon?.name || selectedCoupon?.name}
				{onRemoveCoupon && (
					<ScDropdown slot="suffix" placement="bottom-end">
						<ScButton type="text" slot="trigger" circle>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem onClick={onRemoveCoupon}>
								<ScIcon slot="prefix" name="trash" />
								{__('Remove', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				)}
			</ScStackedListRow>
		</Box>
	);
};
