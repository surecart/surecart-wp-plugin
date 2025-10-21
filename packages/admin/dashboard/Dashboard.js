/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import UpdateModel from '../templates/UpdateModel';
import { ScButton, ScIcon } from '@surecart/components-react';
import Logo from '../templates/Logo';
import Setup from './Setup';
import Chart from './chart';
import Orders from './Orders';
import QuickLinks from './components/QuickLinks';
import Recommended from './Recommended';

export default () => {
	const [liveMode, setLiveMode] = useState(!scData?.claim_url);

	return (
		<UpdateModel
			title={
				<sc-breadcrumbs>
					<sc-breadcrumb>
						<Logo display="block" />
					</sc-breadcrumb>
					<sc-breadcrumb>{__('Dashboard', 'surecart')}</sc-breadcrumb>
				</sc-breadcrumbs>
			}
			button={
				<ScButton
					href={`https://app.surecart.com/dashboard?switch_account_id=${scData?.account_id}`}
					target="_blank"
				>
					{__('App Dashboard', 'surecart')}
					<ScIcon
						name="arrow-up-right"
						slot="suffix"
						aria-hidden="true"
					/>
				</ScButton>
			}
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
			<Chart liveMode={liveMode} setLiveMode={setLiveMode} />
			<Orders liveMode={liveMode} />
			<QuickLinks />
			<Recommended />
		</UpdateModel>
	);
};
