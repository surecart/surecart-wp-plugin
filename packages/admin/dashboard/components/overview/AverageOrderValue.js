/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import {
    ScCard, 
    ScDashboardModule,
} from '@surecart/components-react';

export default () => {
    return (
        <ScDashboardModule    
            css={css`
                width: 33%;

                @media screen and (max-width: 782px) {
                    width: 100%;
                }
            `}
        >
            <span slot="heading">{__('Average Order Value', 'surecart')}</span>
            <ScCard>
                {__('Coming Soon.....', 'surecart')}
            </ScCard>
        </ScDashboardModule>
    );
};