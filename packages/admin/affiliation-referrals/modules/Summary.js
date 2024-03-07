import { ScBlockUi, ScFormatDate } from '@surecart/components-react';
import StatusBadge from '../../components/StatusBadge';
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';

import { __ } from '@wordpress/i18n';

export default ({ referral, loading, changingStatus }) => {
	return (
		<Box title={__('Summary', 'surecart')} loading={loading}>
			<Definition title={__('Status', 'surecart')}>
				<StatusBadge status={referral?.status} />
			</Definition>
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
			{changingStatus && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</Box>
	);
};
