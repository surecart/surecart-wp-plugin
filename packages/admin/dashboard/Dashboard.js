/** @jsx jsx */
// template
import DashboardModel from '../templates/DashboardModel';
import Logo from '../templates/Logo';
import GetStarted from './components/GetStarted';
import LearnMore from './components/LearnMore';
import RecentOrders from './components/RecentOrders';
import Overview from './components/overview/Overview';
import { css, jsx } from '@emotion/core';
import {
	ScFlex,
	ScDivider,
	ScBreadcrumbs,
	ScBreadcrumb,
	ScSwitch,
	ScProvisionalBanner,
	ScAlert,
} from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { hasQueryArg, removeQueryArgs } from '@wordpress/url';
import { useEffect } from 'react';

export default () => {
	const [liveMode, setLiveMode] = useState(true);
	const showClaimSuccess = hasQueryArg(
		window.location.href,
		'account_claimed_success'
	);

	useEffect(() => {
		if (showClaimSuccess) {
			window.history.replaceState(
				{},
				document.title,
				removeQueryArgs(window.location.href, 'account_claimed_success')
			);
		}
	}, [showClaimSuccess]);

	return (
		<>
			{!!scData?.claim_url && (
				<ScProvisionalBanner claimUrl={scData?.claim_url} />
			)}

			<DashboardModel
				title={
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 1em;
						`}
					>
						<ScBreadcrumbs>
							<ScBreadcrumb>
								<Logo display="block" />
							</ScBreadcrumb>
							<ScBreadcrumb href="admin.php?page=sc-dashboard">
								{__('Dashboard', 'surecart')}
							</ScBreadcrumb>
						</ScBreadcrumbs>
					</div>
				}
				end={
					<ScSwitch
						checked={!liveMode}
						onScChange={(e) => {
							setLiveMode(!e.target.checked);
						}}
						reversed
					>
						{__('Test Mode', 'surecart')}
					</ScSwitch>
				}
			>
				<Fragment>
					{!!showClaimSuccess && (
						<ScAlert
							title={__('Setup Complete!', 'surecart')}
							type="success"
							open={!!showClaimSuccess}
							closable
							style={{ fontSize: '16px' }}
						>
							{__(
								'Your store is now connected to SureCart.',
								'surecart'
							)}
						</ScAlert>
					)}
					<GetStarted />
					<Overview liveMode={liveMode} setLiveMode={setLiveMode} />
					<ScDivider style={{ '--spacing': '1em' }} />
					<ScFlex
						style={{ '--sc-flex-column-gap': '2em' }}
						stack="tablet"
					>
						<RecentOrders liveMode={liveMode} />
						<LearnMore />
					</ScFlex>
				</Fragment>
			</DashboardModel>
		</>
	);
};
