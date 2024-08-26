/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInvoiceStatusBadge } from '@surecart/components-react';

export default ({ status }) => {
	return (
		<PanelRow
			css={css`=
				justify-content: space-between;
			`}
		>
			<div>{__('Invoice Status', 'surecart')}</div>
			<div
				css={css`
					padding-right: var(--sc-spacing-large);
				`}
			>
				<ScInvoiceStatusBadge status={status} />
			</div>
		</PanelRow>
	);
};
