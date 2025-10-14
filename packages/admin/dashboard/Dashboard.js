/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import Setup from './Setup';
import Chart from './chart';
import Orders from './Orders';
import QuickLinks from './components/QuickLinks';
import Recommended from './Recommended';

export default () => {
	return (
		<UpdateModel
			title={<Logo display="block" />}
			css={css`
				--sc-card-border-radius: var(--sc-border-radius-x-large);
				padding: 0 var(--sc-spacing-large);
			`}
		>
			<h1
				css={css`
					font-size: var(--sc-font-size-xx-large);
					margin-bottom: var(--sc-spacing-x-large);
				`}
			>
				{__('Welcome to SureCart', 'surecart')}
			</h1>

			<Setup />
			<Chart />
			<Orders />
			<QuickLinks />
			<Recommended />
		</UpdateModel>
	);
};
