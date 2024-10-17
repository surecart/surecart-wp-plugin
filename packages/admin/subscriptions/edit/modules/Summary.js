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
				{subscription?.current_period_start_at_date}
			</div>
			<EndDate subscription={subscription} />
		</Box>
	);
};
