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
		<PanelRow>
			<div>{__('Order', 'surecart')}</div>
			<div
				css={css`
					margin-right: -14px;
				`}
			>
				<PostDropdownButton
					href={orderPageUrl}
					icon={
						<ScIcon
							name="arrow-right"
							css={css`
								margin-left: var(--sc-spacing-small);
								color: var(--sc-color-gray-400);
							`}
						/>
					}
				>
					{__('View Order', 'surecart')}
				</PostDropdownButton>
			</div>
		</PanelRow>
	);
};
