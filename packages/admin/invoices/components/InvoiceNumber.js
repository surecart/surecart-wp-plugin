/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ orderNumber }) => {
	return (
		<PanelRow
			css={css`=
				justify-content: space-between;
			`}
		>
			<div>{__('Invoice Number', 'surecart')}</div>
			<div
				css={css`
					padding-right: var(--sc-spacing-large);
				`}
			>
				#{orderNumber}
			</div>
		</PanelRow>
	);
};
