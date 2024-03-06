/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { format } from '@wordpress/date';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import StatusBadge from '../../components/StatusBadge';
import { ScFormatDate } from '@surecart/components-react';

export default ({ affiliation, loading }) => {
	return (
		<Box title={__('Affiliate Details', 'surecart')} loading={loading}>
			<Fragment>
				<Definition title={__('Name', 'surecart')}>
					{affiliation?.first_name + ' ' + affiliation?.last_name}
				</Definition>

				<Definition title={__('Email', 'surecart')}>
					{affiliation?.email}
				</Definition>

				<Definition title={__('Payout Email', 'surecart')}>
					{affiliation?.payout_email}
				</Definition>

				<Definition title={__('Status', 'surecart')}>
					<StatusBadge
						status={!!affiliation?.active ? 'active' : 'inactive'}
					/>
				</Definition>

				<hr />

				{!!affiliation?.updated_at && (
					<Definition title={__('Last Updated', 'surecart')}>
						<ScFormatDate
							month="short"
							day="numeric"
							year="numeric"
							date={affiliation.updated_at}
						/>
					</Definition>
				)}

				{!!affiliation?.created_at && (
					<Definition title={__('Created', 'surecart')}>
						<ScFormatDate
							month="short"
							day="numeric"
							year="numeric"
							date={affiliation.created_at}
						/>
					</Definition>
				)}
			</Fragment>
		</Box>
	);
};
