/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import Setup from './Setup';
import Chart from './chart';
import Orders from './Orders';

export default () => {
	return (
		<div
			css={css`
				--sc-card-border-radius: var(--sc-border-radius-x-large);
			`}
		>
			<UpdateModel title={<Logo display="block" />}>
				<h1
					css={css`
						font-size: var(--sc-font-size-xx-large);
						margin-bottom: var(--sc-spacing-x-large);
					`}
				>
					{__('Wecome to SureCart', 'surecart')}
				</h1>

				<Setup />

				<Chart />

				<Orders />
			</UpdateModel>
		</div>
	);
};
