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
import PostDropdownButton from '../../components/PostDropdownButton';

export default ({ orderPageUrl }) => {
	return (
		<PanelRow
			css={css`=
				justify-content: space-between;
			`}
		>
			<div
				css={css`
					display: block;
					flex-shrink: 0;
					padding: 6px 0;
					width: 45%;
				`}
			>
				{__('Order Page', 'surecart')}
			</div>
			<div
				css={css`
					padding-right: 4px;
				`}
			>
				<PostDropdownButton
					href={orderPageUrl}
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
