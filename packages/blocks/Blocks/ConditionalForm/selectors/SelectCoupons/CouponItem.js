import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import FilterItem from '../../../../../admin/components/filters/FilterItem';
import { ScFormatNumber } from '@surecart/components-react';

export default (props) => {
	const { id } = props;
	const { item, hasLoadedItem } = useSelect(
		(select) => {
			return {
				item: select(coreStore).getEntityRecord(
					'surecart',
					'coupon',
					id
				),
				hasLoadedItem: select(coreStore).hasFinishedResolution(
					'getEntityRecord',
					['surecart', 'coupon', id]
				),
			};
		},
		[id]
	);

	const formattedDiscount = () => {
		if (item?.percent_off) {
			return sprintf(__('%s%% off', 'surecart'), item?.percent_off);
		}
		if (item?.amount_off) {
			return (
				<ScFormatNumber
					type="currency"
					currency={item?.currency}
					value={item?.amount_off}
				/>
			);
		}
	};

	return (
		<FilterItem loading={!hasLoadedItem} {...props}>
			<strong>{item?.name}</strong> &mdash; {formattedDiscount()}
		</FilterItem>
	);
};
