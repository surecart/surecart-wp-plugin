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
} from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

export default () => {
	const [liveMode, setLiveMode] = useState(true);
	return (
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
		>
			<Fragment>
				<GetStarted />
				<Overview liveMode={liveMode} setLiveMode={setLiveMode} />
				<ScDivider style={{ '--spacing': '1em' }} />
				<ScFlex style={{ '--sc-flex-column-gap': '2em' }}>
					<RecentOrders liveMode={liveMode} />
					<LearnMore />
				</ScFlex>
			</Fragment>
		</DashboardModel>
	);
};
