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
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({ orderPdfUrl }) => {
	return (
		<PanelRow
			css={css`=
				justify-content: space-between;
			`}
		>
			<div>{__('Receipt', 'surecart')}</div>
			<div
				css={css`
					padding-right: var(--sc-spacing-x-small);
				`}
			>
				<ScButton
					type="text"
					href={orderPdfUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{__('Download', 'surecart')}
					<ScIcon slot="suffix" name="external-link" />
				</ScButton>
			</div>
		</PanelRow>
	);
};
