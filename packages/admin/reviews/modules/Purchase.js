/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ purchase, loading }) => {
	if (!purchase?.id || loading) {
		return null;
	}

	return (
		<Box
			title={__('Purchase', 'surecart')}
			css={css`
				margin-bottom: 1em;
			`}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
				`}
			>
				<ScInput
					label={__('Order', 'surecart')}
					value={
						<a href={`admin.php?page=sc-orders&action=edit&id=${purchase.order}`}>
							{purchase.order}
						</a>
					}
					readonly
				/>
				{purchase.created_at_date_time && (
					<ScInput
						label={__('Purchase Date', 'surecart')}
						value={purchase.created_at_date_time}
						readonly
					/>
				)}
			</div>
		</Box>
	);
};
