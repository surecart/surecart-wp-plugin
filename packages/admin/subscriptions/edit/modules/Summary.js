import { ScFormatDate } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import EndDate from '../../shared/EndDate';

export default ({ loading, subscription }) => {
	return (
		<Box title={__('Summary', 'surecart')} loading={loading}>
			<div>
				<div>
					<strong>{__('Started', 'surecart')}</strong>
				</div>
				<ScFormatDate
					date={subscription?.current_period_start_at}
					type="timestamp"
					month="long"
					day="numeric"
					year="numeric"
				></ScFormatDate>
			</div>
			<EndDate subscription={subscription} />
		</Box>
	);
};
