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
import { ScIcon } from '@surecart/components-react';
import PostDropdownButton from '../../../components/PostDropdownButton';

export default ({ invoicePageLink }) => {
	return (
		<PanelRow>
			<div>{__('Invoice', 'surecart')}</div>
			<div
				css={css`
					margin-right: -14px;
				`}
			>
				<PostDropdownButton
					href={invoicePageLink}
					target="_blank"
					rel="noopener noreferrer"
					icon={
						<ScIcon
							name="external-link"
							css={css`
								margin-left: var(--sc-spacing-small);
								color: var(--sc-color-gray-300);
							`}
						/>
					}
				>
					{__('View', 'surecart')}
				</PostDropdownButton>
			</div>
		</PanelRow>
	);
};
