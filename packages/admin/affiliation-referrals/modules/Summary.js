import { ScTag } from '@surecart/components-react';
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';

import { __ } from '@wordpress/i18n';

export default ({ referral, loading }) => {
	return (
		<Box title={__('Summary', 'surecart')} loading={loading}>
			<Definition title={__('Status', 'surecart')}>
				<ScTag type={referral?.status_type}>
					{referral?.status_display_text}
				</ScTag>
			</Definition>

			{referral?.manual && (
				<Definition title={__('Creation Mode', 'surecart')}>
					{__('Manual', 'surecart')}
				</Definition>
			)}

			<hr />

			{!!referral?.updated_at && (
				<Definition title={__('Last Updated', 'surecart')}>
					{referral.updated_at_date_time}
				</Definition>
			)}

			{!!referral?.created_at && (
				<Definition title={__('Created', 'surecart')}>
					{referral.created_at_date_time}
				</Definition>
			)}
		</Box>
	);
};
