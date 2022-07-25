/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import {
    ScCard, 
    ScDashboardModule, 
    ScStackedList, 
    ScStackedListRow,
    ScIcon,
    ScButton,
} from '@surecart/components-react';

export default () => {
    return (
        <ScDashboardModule
            css={css`
                width: 67%;
                @media screen and (max-width: 782px) {
                    width: 100%;
                }
            `}
        >
            <span slot="heading">Recent Orders</span>
            <ScButton slot="end" type="link" href="#">
            {__('View All', 'surecart')}
            <ScIcon  slot="suffix" name="chevron-right" />
            </ScButton>
            <ScCard noPadding>
                <ScStackedList>
                    <ScStackedListRow style={{ '--columns': '5' }}>
                        { __( 'Coming soon.....', 'surecart' ) }
                    </ScStackedListRow>
                </ScStackedList>
            </ScCard>
        </ScDashboardModule>
    );
};
