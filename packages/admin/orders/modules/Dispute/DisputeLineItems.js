/**
 * External dependencies.
 */
import { useEntityRecords } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import DisputeLineItem from './DisputeLineItem';

export default ({ chargeIds, order }) => {
	if (!chargeIds?.length) {
		return null;
	}

	const { records: disputes } = useEntityRecords('surecart', 'dispute', {
		context: 'edit',
		charge_ids: chargeIds,
		per_page: 100,
	});

	return (disputes || []).map((dispute) => (
		<DisputeLineItem
			key={dispute.id}
			order={order}
			dispute={dispute}
			label={__('Dispute', 'surecart')}
		/>
	));
};
