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
import Reviewer from './Reviewer';
import Product from './Product';
import { ScIcon, ScText } from '@surecart/components-react';

export default ({ review, loading }) => {
	const { updated_at_date_time, created_at_date_time } = review || {};

	return (
		<Box
			title={__('Summary', 'surecart')}
			loading={loading}
			header_action={
				!!review?.verified && (
					<div
						css={css`
							gap: 8px;
							display: flex;
							align-items: center;
							font-weight: 500;
							justify-content: end;
							width: 100%;
							margin: -8px 0;
						`}
					>
						<ScText
							css={css`
								color: var(--sc-color-gray-500);
							`}
						>
							{__('Verified Buyer', 'surecart')}
						</ScText>

						<span style={{ color: 'var(--sc-color-success-500)' }}>
							<ScIcon
								name="verified"
								style={{
									fontSize: '24px',
									color: 'var(--sc-color-success-500)',
								}}
							/>
						</span>
					</div>
				)
			}
		>
			<Product review={review} loading={loading} />
			<Reviewer review={review} loading={loading} />

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
