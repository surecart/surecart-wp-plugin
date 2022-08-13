/** @jsx jsx */
import { css, jsx } from '@emotion/core';

// template
import DashboardModel from '../templates/DashboardModel';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Logo from '../templates/Logo';

import GetStarted from './components/GetStarted';
import RecentOrders from './components/RecentOrders';
import LearnMore from './components/LearnMore';
import Overview from './components/overview/Overview';

import {
	ScFlex,
	ScDivider,
	ScBreadcrumbs,
	ScBreadcrumb,
} from '@surecart/components-react';

export default () => {
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
				<Overview />
				<ScDivider style={{ '--spacing': '1em' }} />
				<ScFlex style={{ '--sc-flex-column-gap': '2em' }}>
					<RecentOrders />
					<LearnMore />
				</ScFlex>
			</Fragment>
		</DashboardModel>
	);
};
