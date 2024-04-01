import { ScBlockUi, ScFormatDate } from '@surecart/components-react';
import StatusBadge from '../../components/StatusBadge';
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';

import { __ } from '@wordpress/i18n';

export default ({ referral, loading }) => {
	return (
		<Box title={__('Summary', 'surecart')} loading={loading}>
			<Definition title={__('Status', 'surecart')}>
				<StatusBadge status={referral?.status} />
			</Definition>

			{referral?.manual && (
				<Definition title={__('Creation Mode', 'surecart')}>
					{__('Manual', 'surecart')}
				</Definition>
			)}

			<hr />

			{!!referral?.updated_at && (
				<Definition title={__('Last Updated', 'surecart')}>
					<ScFormatDate
						type="timestamp"
						month="short"
						day="numeric"
						year="numeric"
						date={referral.created_at}
					/>
				</Definition>
			)}

			{!!referral?.created_at && (
				<Definition title={__('Created', 'surecart')}>
					<ScFormatDate
						type="timestamp"
						month="short"
						day="numeric"
						year="numeric"
						date={referral.created_at}
					/>
				</Definition>
			)}
		</Box>
	);
};
