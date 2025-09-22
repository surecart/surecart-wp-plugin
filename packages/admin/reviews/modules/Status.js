/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import { ScTag } from '@surecart/components-react';

export default ({ review, loading }) => {
	const { status_display, updated_at_date_time, created_at_date_time } =
		review || {};

	return (
		<Box title={__('Status', 'surecart')} loading={loading}>
			<Definition title={__('Status', 'surecart')}>
				<ScTag type={review?.status_type || 'default'}>
					{status_display || '-'}
				</ScTag>
			</Definition>

			{!!created_at_date_time && (
				<Definition title={__('Submitted At', 'surecart')}>
					{created_at_date_time}
				</Definition>
			)}

			{!!updated_at_date_time && (
				<Definition title={__('Last Updated', 'surecart')}>
					{updated_at_date_time}
				</Definition>
			)}
		</Box>
	);
};
