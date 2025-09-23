/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import { ScIcon, ScTag } from '@surecart/components-react';

export default ({ review, loading }) => {
	const {
		status_type,
		status_display,
		updated_at_date_time,
		created_at_date_time,
		product,
	} = review || {};

	return (
		<Box title={__('Summary', 'surecart')} loading={loading}>
			<Definition title={__('Status', 'surecart')}>
				<ScTag type={status_type || 'default'}>
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

			{product?.id && (
				<Definition title={__('Product', 'surecart')}>
					<a
						href={addQueryArgs('admin.php', {
							page: 'sc-products',
							action: 'edit',
							id: product?.id,
						})}
						css={css`
							text-decoration: none;
							color: inherit;
							display: flex;
							justify-content: flex-end;
							gap: 4px;
						`}
						target="_blank"
					>
						<span>{product?.name}</span>
						<ScIcon name="external-link" />
					</a>
				</Definition>
			)}
		</Box>
	);
};
