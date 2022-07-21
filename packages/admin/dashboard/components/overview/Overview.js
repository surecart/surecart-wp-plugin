/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';

import Revenue from './Revenue';
import Orders from './Orders';
import AverageOrderValue from './AverageOrderValue';

export default () => {
    return (
        <Fragment>
            <div>
            <h3
                    css={css`
                        font-weight: 600;
                        font-size: 28px;
                        line-height: 28px;
                        color: #334155;               
                    `}
                >
                    { __( 'Overview', 'surecart' ) }
                </h3>
            </div>

            <div
                css={css`
                    display: flex;
                    column-gap: 2em;
                    
                    @media screen and (max-width: 782px) {
                        display: inherit;
                    }
                `}
            >
                <Revenue />
                <Orders />
                <AverageOrderValue />
            </div>
        </Fragment>
    );
};
