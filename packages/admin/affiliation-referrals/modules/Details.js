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

export default ({ affiliation, loading }) => {
	console.log('affiliation', affiliation);
	return (
		<Box
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Affiliate Details', 'surecart')}
				</div>
			}
			loading={loading}
		>
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
						{format(
							'F j, Y',
							new Date(affiliation.updated_at * 1000)
						)}
					</Definition>
				)}

				{!!affiliation?.created_at && (
					<Definition title={__('Created', 'surecart')}>
						{format(
							'F j, Y',
							new Date(affiliation.created_at * 1000)
						)}
					</Definition>
				)}
			</Fragment>
		</Box>
	);
};
