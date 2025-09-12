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

export default ({ review, loading }) => {
	if (loading) {
		return null;
	}

	const { status_display_text, updated_at_date_time, created_at_date_time } =
		review || {};

	return (
		<Box title={__('Status', 'surecart')}>
			<Definition title={__('Status', 'surecart')}>
				{status_display_text || '-'}
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
