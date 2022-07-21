/** @jsx jsx */
import { css, jsx } from '@emotion/core';

// template
import DashboardModel from '../templates/DashboardModel';

import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import Logo from '../templates/Logo';

import GetStarted from './components/GetStarted';
import RecentOrders from './components/RecentOrders';
import LearnMore from './components/LearnMore';
import Overview from './components/overview/Overview';

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
                    <sc-breadcrumbs>
                        <sc-breadcrumb>
                            <Logo display="block" />
                        </sc-breadcrumb>
                        <sc-breadcrumb href="admin.php?page=sc-dashboard">
                            {__('Dashboard', 'surecart')}
                        </sc-breadcrumb>
                    </sc-breadcrumbs>
                </div>
            }
        >
            <Fragment>
                <GetStarted />
                <hr/>
                <Overview />
                <hr/>

                <div
                    css={css`
                        display: flex;
                        column-gap: 2em;
                        
                        @media screen and (max-width: 782px) {
                            display: inherit;
                        }
                    `}
                >
                    <RecentOrders />
                    <LearnMore />
                </div>
            </Fragment>
        </DashboardModel>
    );
};
