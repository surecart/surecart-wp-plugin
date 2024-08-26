/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { PanelRow, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScIcon } from '@surecart/components-react';

export default ({ orderPageUrl }) => {
	return (
		<PanelRow
			css={css`=
				justify-content: space-between;
			`}
		>
			<div>{__('Order Page', 'surecart')}</div>
			<div
				css={css`
					padding-right: var(--sc-spacing-x-small);
				`}
			>
				<Button
					css={css`
						height: auto;
						text-align: right;
						white-space: normal !important;
						word-break: break-word;
					`}
					variant="tertiary"
					href={orderPageUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{__('View', 'surecart')}
					&nbsp;&nbsp;
					<ScIcon name="external-link" />
				</Button>
			</div>
		</PanelRow>
	);
};
