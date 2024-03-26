/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import StatusBadge from '../../components/StatusBadge';
import { ScFormatDate } from '@surecart/components-react';

export default ({ affiliation, loading }) => {
	const {
		first_name,
		last_name,
		email,
		payout_email,
		active,
		created_at,
		updated_at,
	} = affiliation;

	return (
		<Box title={__('Affiliate Details', 'surecart')} loading={loading}>
			<Fragment>
				<Definition title={__('Name', 'surecart')}>
					{first_name + ' ' + last_name}
				</Definition>

				<Definition title={__('Email', 'surecart')}>{email}</Definition>

				<Definition title={__('Payout Email', 'surecart')}>
					{payout_email}
				</Definition>

				<Definition title={__('Status', 'surecart')}>
					<StatusBadge status={active ? 'active' : 'inactive'} />
				</Definition>

				<hr />

				{updated_at && (
					<Definition title={__('Last Updated', 'surecart')}>
						<ScFormatDate
							type="timestamp"
							month="short"
							day="numeric"
							year="numeric"
							date={updated_at}
						/>
					</Definition>
				)}

				{created_at && (
					<Definition title={__('Created', 'surecart')}>
						<ScFormatDate
							type="timestamp"
							month="short"
							day="numeric"
							year="numeric"
							date={created_at}
						/>
					</Definition>
				)}
			</Fragment>
		</Box>
	);
};
