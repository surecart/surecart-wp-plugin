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
import { ScFormatDate, ScTag } from '@surecart/components-react';

export default ({ affiliation, loading }) => {
	const {
		status_type,
		status_display_text,
		display_name,
		email,
		code,
		payout_email,
		created_at,
		updated_at,
	} = affiliation;

	return (
		<Box title={__('Details', 'surecart')} loading={loading}>
			<Fragment>
				<Definition title={__('Name', 'surecart')}>
					{display_name}
				</Definition>

				<Definition title={__('Referral Code', 'surecart')}>
					<sc-prose>
						<code>{code}</code>
					</sc-prose>
				</Definition>

				<Definition title={__('Email', 'surecart')}>{email}</Definition>

				<Definition title={__('Payout Email', 'surecart')}>
					{payout_email}
				</Definition>

				<Definition title={__('Status', 'surecart')}>
					<ScTag type={status_type}>{status_display_text}</ScTag>
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
